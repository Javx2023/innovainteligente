#!/usr/bin/env python3
"""
Servidor local de Innovainteligente.

Sirve la landing y el panel de leads, y expone una API para registrar las
solicitudes del formulario. Los datos se guardan en SQLite y se reflejan en un
archivo JSON legible.

Uso:
    python3 server/app.py
    python3 server/app.py --host 127.0.0.1 --port 8080

Correo (opcional, para notificar a la recepción):
    SMTP_HOST=smtp.ejemplo.com SMTP_PORT=587 SMTP_USER=usuario SMTP_PASSWORD=clave \
    python3 server/app.py

Variables:
    LEADS_EMAIL_TO   Destinatario (por defecto javier@innovainteligente.com)
    SMTP_HOST        Servidor SMTP. Si falta, el lead se guarda y queda "pendiente_smtp".
    SMTP_PORT        587 por defecto.
    SMTP_USER        Usuario SMTP.
    SMTP_PASSWORD    Contraseña SMTP.
    SMTP_FROM        Remitente. Por defecto SMTP_USER o no-reply@innovainteligente.com.
    SMTP_TLS         1 (por defecto) para STARTTLS.
    SMTP_SSL         1 para conexión SSL directa.
    SMTP_SERVER_HOSTNAME  Nombre (SNI) a validar en el certificado TLS cuando
                     SMTP_HOST es una IP interna (opcional).

El servidor escucha en 127.0.0.1 por defecto. En producción el panel y la API
de administración se protegen con autenticación básica (DASHBOARD_PASSWORD).
"""

from __future__ import annotations

import argparse
import base64
import csv
import io
import hmac
import json
import mimetypes
import os
import re
import smtplib
import socket
import sqlite3
import ssl
import sys
import threading
from datetime import datetime, timedelta, timezone
from email.message import EmailMessage
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlsplit

PROJECT_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_DATA_DIR = Path(__file__).resolve().parent / "data"

STATIC_ROOTS = {
    "/landing/": PROJECT_ROOT / "landing",
    "/dashboard/": PROJECT_ROOT / "dashboard",
    "/ofertas/": PROJECT_ROOT / "ofertas",
    "/glosario/": PROJECT_ROOT / "glosario",
    "/ds/": PROJECT_ROOT / "ds",
}

PILLARS = {
    "",
    "Automatización e inteligencia de procesos",
    "Investigación, desarrollo e innovación",
    "Transformación estratégica y gobernanza de IA",
}

STATUSES = ("nuevo", "contactado", "descartado")
APP_ENV = os.environ.get("APP_ENV", "development").strip().lower()
DASHBOARD_USER = os.environ.get("DASHBOARD_USER", "admin").strip() or "admin"
DASHBOARD_PASSWORD = os.environ.get("DASHBOARD_PASSWORD", "")
ADMIN_AUTH_REQUIRED = bool(DASHBOARD_PASSWORD) or APP_ENV == "production"

EMAIL_TO = os.environ.get("LEADS_EMAIL_TO", "javier@innovainteligente.com").strip()
SMTP_HOST = os.environ.get("SMTP_HOST", "").strip()
SMTP_PORT = int(os.environ.get("SMTP_PORT", "587") or "587")
SMTP_USER = os.environ.get("SMTP_USER", "").strip()
SMTP_PASSWORD = os.environ.get("SMTP_PASSWORD", "")
SMTP_FROM = os.environ.get("SMTP_FROM", "").strip() or SMTP_USER or "no-reply@innovainteligente.com"
SMTP_TLS = os.environ.get("SMTP_TLS", "1") not in {"0", "false", "False", ""}
SMTP_SSL = os.environ.get("SMTP_SSL", "0") in {"1", "true", "True"}
SMTP_SERVER_HOSTNAME = os.environ.get("SMTP_SERVER_HOSTNAME", "").strip()

EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]{2,}$")
EMAIL_CONFIGURED = bool(SMTP_HOST)

SCHEMA = """
CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TEXT NOT NULL,
    nombre TEXT NOT NULL,
    empresa TEXT NOT NULL DEFAULT '',
    correo TEXT NOT NULL,
    pilar TEXT NOT NULL DEFAULT '',
    mensaje TEXT NOT NULL,
    consentimiento INTEGER NOT NULL DEFAULT 1,
    estado TEXT NOT NULL DEFAULT 'nuevo',
    email_estado TEXT NOT NULL DEFAULT 'pendiente_smtp',
    origen TEXT NOT NULL DEFAULT 'landing',
    user_agent TEXT NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS idx_leads_estado ON leads (estado);
CREATE INDEX IF NOT EXISTS idx_leads_fecha ON leads (created_at);
"""


class ApiError(Exception):
    def __init__(self, status: int, message: str, fields: dict | None = None):
        super().__init__(message)
        self.status = status
        self.message = message
        self.fields = fields or {}


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def csv_safe(value) -> str:
    """Evita que una celda se interprete como fórmula en Excel/LibreOffice."""
    text = str(value)
    if text.startswith(("=", "+", "-", "@", "\t", "\r")):
        return "'" + text
    return text


def clean_text(value, limit: int, allow_newlines: bool = False) -> str:
    text = str(value or "")
    if not allow_newlines:
        text = text.replace("\r", " ").replace("\n", " ")
    allowed = []
    for char in text:
        if char.isprintable() or (allow_newlines and char in "\n\t"):
            allowed.append(char)
    text = "".join(allowed).strip()
    if allow_newlines:
        text = re.sub(r"\r\n?", "\n", text)
        text = re.sub(r"\n{3,}", "\n\n", text)
    return text[:limit]


class LeadStore:
    """Almacén de leads: SQLite como fuente de verdad y JSON como espejo."""

    def __init__(self, data_dir: Path):
        self.data_dir = Path(data_dir)
        self.data_dir.mkdir(parents=True, exist_ok=True)
        self.db_path = self.data_dir / "leads.sqlite3"
        self.json_path = self.data_dir / "leads.json"
        self._lock = threading.RLock()
        with self._connect() as conn:
            conn.executescript(SCHEMA)
        self.sync_json()

    def _connect(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.db_path, timeout=10)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA journal_mode=WAL")
        conn.execute("PRAGMA busy_timeout=10000")
        return conn

    def _write_json(self, rows: list[dict]) -> None:
        payload = []
        for row in rows:
            item = dict(row)
            item["consentimiento"] = bool(item["consentimiento"])
            payload.append(item)
        tmp = self.json_path.with_suffix(".json.tmp")
        tmp.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        os.replace(tmp, self.json_path)

    def sync_json(self) -> None:
        with self._lock, self._connect() as conn:
            rows = [dict(row) for row in conn.execute("SELECT * FROM leads ORDER BY id DESC")]
            self._write_json(rows)

    def add(self, data: dict, user_agent: str, email_estado: str) -> dict:
        with self._lock, self._connect() as conn:
            cursor = conn.execute(
                """
                INSERT INTO leads
                    (created_at, nombre, empresa, correo, pilar, mensaje,
                     consentimiento, estado, email_estado, origen, user_agent)
                VALUES (?, ?, ?, ?, ?, ?, 1, 'nuevo', ?, 'landing', ?)
                """,
                (
                    utc_now(),
                    data["nombre"],
                    data["empresa"],
                    data["correo"],
                    data["pilar"],
                    data["mensaje"],
                    email_estado,
                    user_agent,
                ),
            )
            row = conn.execute("SELECT * FROM leads WHERE id = ?", (cursor.lastrowid,)).fetchone()
            all_rows = [dict(item) for item in conn.execute("SELECT * FROM leads ORDER BY id DESC")]
            self._write_json(all_rows)
            result = dict(row)
            result["consentimiento"] = bool(result["consentimiento"])
            return result

    def set_email_status(self, lead_id: int, status: str) -> None:
        with self._lock, self._connect() as conn:
            conn.execute("UPDATE leads SET email_estado = ? WHERE id = ?", (status, lead_id))
            all_rows = [dict(item) for item in conn.execute("SELECT * FROM leads ORDER BY id DESC")]
            self._write_json(all_rows)

    def set_status(self, lead_id: int, status: str) -> dict | None:
        with self._lock, self._connect() as conn:
            cursor = conn.execute("UPDATE leads SET estado = ? WHERE id = ?", (status, lead_id))
            if cursor.rowcount == 0:
                return None
            row = conn.execute("SELECT * FROM leads WHERE id = ?", (lead_id,)).fetchone()
            all_rows = [dict(item) for item in conn.execute("SELECT * FROM leads ORDER BY id DESC")]
            self._write_json(all_rows)
            result = dict(row)
            result["consentimiento"] = bool(result["consentimiento"])
            return result

    def overview(self) -> dict:
        with self._lock, self._connect() as conn:
            rows = []
            for row in conn.execute("SELECT * FROM leads ORDER BY id DESC"):
                item = dict(row)
                item["consentimiento"] = bool(item["consentimiento"])
                rows.append(item)

        total = len(rows)
        counts = {status: 0 for status in STATUSES}
        for row in rows:
            counts[row["estado"]] = counts.get(row["estado"], 0) + 1

        limit = (datetime.now(timezone.utc) - timedelta(days=7)).isoformat(timespec="seconds")
        last_week = sum(1 for row in rows if row["created_at"] >= limit)

        return {
            "leads": rows,
            "stats": {
                "total": total,
                "nuevo": counts.get("nuevo", 0),
                "contactado": counts.get("contactado", 0),
                "descartado": counts.get("descartado", 0),
                "ultimos_7_dias": last_week,
            },
        }

    def rows(self) -> list[dict]:
        return self.overview()["leads"]


def send_notification(lead: dict) -> str:
    """Envía el aviso por correo si hay SMTP configurado. Devuelve el estado."""
    if not EMAIL_CONFIGURED:
        return "pendiente_smtp"

    message = EmailMessage()
    message["Subject"] = "Nuevo lead · {} · {}".format(
        lead["nombre"], lead["pilar"] or "Sin pilar"
    )
    message["From"] = SMTP_FROM
    message["To"] = EMAIL_TO
    body = "\n".join(
        [
            "Nueva solicitud desde la landing de Innovainteligente.",
            "",
            "Nombre: {}".format(lead["nombre"]),
            "Empresa: {}".format(lead["empresa"] or "No indicada"),
            "Correo: {}".format(lead["correo"]),
            "Pilar de interés: {}".format(lead["pilar"] or "No indicado"),
            "Fecha: {}".format(lead["created_at"]),
            "",
            "Proceso o reto:",
            lead["mensaje"],
            "",
            "ID del lead: {}".format(lead["id"]),
        ]
    )
    message.set_content(body)

    try:
        if SMTP_SSL:
            if SMTP_SERVER_HOSTNAME:
                ctx = ssl.create_default_context()
                raw = socket.create_connection((SMTP_HOST, SMTP_PORT), timeout=12)
                tls = ctx.wrap_socket(raw, server_hostname=SMTP_SERVER_HOSTNAME)
                smtp = smtplib.SMTP()
                smtp.sock = tls
                smtp.file = None
                smtp.getreply()
            else:
                smtp = smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, timeout=12)
        else:
            smtp = smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=12)
        with smtp:
            smtp.ehlo()
            if SMTP_TLS and not SMTP_SSL:
                smtp.starttls(context=ssl.create_default_context())
                smtp.ehlo()
            if SMTP_USER:
                smtp.login(SMTP_USER, SMTP_PASSWORD)
            smtp.send_message(message)
        return "enviado"
    except Exception as exc:  # noqa: BLE001
        print("[email] No se pudo enviar el aviso: {}".format(exc), file=sys.stderr)
        return "error"


def validate_lead(payload: dict) -> dict:
    errors = {}

    nombre = clean_text(payload.get("nombre"), 120)
    if not nombre:
        errors["nombre"] = "El nombre es obligatorio."

    empresa = clean_text(payload.get("empresa"), 160)

    correo = clean_text(payload.get("correo"), 200).lower()
    if not EMAIL_RE.match(correo):
        errors["correo"] = "El correo no es válido."

    pilar = clean_text(payload.get("pilar"), 120)
    if pilar not in PILLARS:
        errors["pilar"] = "El pilar seleccionado no es válido."

    mensaje = clean_text(payload.get("mensaje"), 4000, allow_newlines=True)
    if len(mensaje) < 3:
        errors["mensaje"] = "Describe brevemente el proceso."

    if payload.get("consentimiento") is not True:
        errors["consentimiento"] = "Debes aceptar el contacto."

    if errors:
        raise ApiError(400, "Revisa los campos de la solicitud.", errors)

    return {
        "nombre": nombre,
        "empresa": empresa,
        "correo": correo,
        "pilar": pilar,
        "mensaje": mensaje,
    }


class AppServer(ThreadingHTTPServer):
    daemon_threads = True

    def __init__(self, address, store: LeadStore):
        super().__init__(address, Handler)
        self.store = store


class Handler(BaseHTTPRequestHandler):
    server_version = "InnovainteligenteLeads/1.0"
    protocol_version = "HTTP/1.1"

    # ------------------------------------------------------------------
    # Autenticación del panel
    # ------------------------------------------------------------------
    def is_admin_authorized(self) -> bool:
        if not ADMIN_AUTH_REQUIRED:
            return True
        if not DASHBOARD_PASSWORD:
            return False
        header = self.headers.get("Authorization", "")
        if not header.lower().startswith("basic "):
            return False
        try:
            decoded = base64.b64decode(header[6:].strip()).decode("utf-8")
            user, _, password = decoded.partition(":")
            return hmac.compare_digest(user, DASHBOARD_USER) and hmac.compare_digest(
                password, DASHBOARD_PASSWORD
            )
        except (ValueError, UnicodeDecodeError):
            return False

    def require_admin(self) -> bool:
        if self.is_admin_authorized():
            return True
        if not DASHBOARD_PASSWORD:
            self.send_error_json(
                503,
                "Panel no configurado: define DASHBOARD_PASSWORD en el entorno.",
            )
            return False
        body = json.dumps(
            {"error": "Autenticación requerida para el panel."}, ensure_ascii=False
        ).encode("utf-8")
        self.send_response(401)
        self.send_header("WWW-Authenticate", 'Basic realm="Panel de leads", charset="UTF-8"')
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.common_headers()
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(body)
        return False

    # ------------------------------------------------------------------
    # Utilidades de respuesta
    # ------------------------------------------------------------------
    def common_headers(self) -> None:
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "no-referrer")
        self.send_header("X-Frame-Options", "DENY")
        self.send_header("Cache-Control", "no-store")

    def send_json(self, status: int, payload: dict) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.common_headers()
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(body)

    def send_error_json(self, status: int, message: str, fields: dict | None = None) -> None:
        payload = {"error": message}
        if fields:
            payload["fields"] = fields
        self.send_json(status, payload)

    def redirect(self, location: str) -> None:
        self.send_response(HTTPStatus.SEE_OTHER)
        self.send_header("Location", location)
        self.send_header("Content-Length", "0")
        self.common_headers()
        self.end_headers()

    # ------------------------------------------------------------------
    # Lectura del cuerpo
    # ------------------------------------------------------------------
    def read_json(self) -> dict:
        try:
            length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            raise ApiError(400, "Longitud de contenido inválida.")
        if length <= 0:
            raise ApiError(400, "Falta el cuerpo de la solicitud.")
        if length > 32 * 1024:
            raise ApiError(413, "La solicitud es demasiado grande.")
        raw = self.rfile.read(length)
        try:
            payload = json.loads(raw.decode("utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError):
            raise ApiError(400, "El cuerpo debe ser JSON válido.")
        if not isinstance(payload, dict):
            raise ApiError(400, "El cuerpo debe ser un objeto JSON.")
        return payload

    # ------------------------------------------------------------------
    # Archivos estáticos
    # ------------------------------------------------------------------
    def resolve_static(self, path: str) -> Path | None:
        for prefix, root in STATIC_ROOTS.items():
            if path == prefix.rstrip("/"):
                return root / "index.html"
            if not path.startswith(prefix):
                continue
            relative = path[len(prefix) :]
            if not relative:
                relative = "index.html"
            root_resolved = root.resolve()
            target = (root / relative).resolve()
            if target != root_resolved and root_resolved not in target.parents:
                return None
            if target.is_dir():
                target = target / "index.html"
            if not target.is_file():
                return None
            return target
        return None

    def serve_static(self) -> None:
        path = unquote(urlsplit(self.path).path)
        if path == "/dashboard" or path.startswith("/dashboard/"):
            if not self.require_admin():
                return
        if path in ("/", ""):
            self.redirect("/landing/")
            return
        if path in {prefix.rstrip("/") for prefix in STATIC_ROOTS}:
            self.redirect(path + "/")
            return

        target = self.resolve_static(path)
        if target is None:
            self.send_error(HTTPStatus.NOT_FOUND, "Recurso no encontrado")
            return

        content_type = mimetypes.guess_type(str(target))[0] or "application/octet-stream"
        if content_type.startswith("text/") or content_type in {
            "application/javascript",
            "application/json",
            "image/svg+xml",
        }:
            content_type += "; charset=utf-8"

        try:
            data = target.read_bytes()
        except OSError:
            self.send_error(HTTPStatus.INTERNAL_SERVER_ERROR, "No se pudo leer el recurso")
            return

        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(data)))
        self.common_headers()
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(data)

    # ------------------------------------------------------------------
    # API
    # ------------------------------------------------------------------
    def api_health(self) -> None:
        self.send_json(
            HTTPStatus.OK,
            {
                "ok": True,
                "service": "innovainteligente",
                "status": "ok",
            },
        )

    def api_list(self) -> None:
        overview = self.server.store.overview()
        overview["email_configured"] = EMAIL_CONFIGURED
        overview["email_to"] = EMAIL_TO
        self.send_json(HTTPStatus.OK, overview)

    def api_create(self) -> None:
        payload = self.read_json()
        data = validate_lead(payload)
        user_agent = clean_text(self.headers.get("User-Agent", ""), 300)
        lead = self.server.store.add(data, user_agent, "pendiente")
        email_status = send_notification(lead)
        self.server.store.set_email_status(lead["id"], email_status)
        lead["email_estado"] = email_status
        print(
            "[lead] #{} · {} · {} · correo={}".format(
                lead["id"], lead["nombre"], lead["pilar"] or "sin pilar", email_status
            )
        )
        self.send_json(HTTPStatus.CREATED, {"ok": True, "id": lead["id"]})

    def api_update(self, lead_id: int) -> None:
        payload = self.read_json()
        status = clean_text(payload.get("estado"), 20)
        if status not in STATUSES:
            raise ApiError(400, "Estado no válido.")
        lead = self.server.store.set_status(lead_id, status)
        if lead is None:
            raise ApiError(404, "El lead no existe.")
        self.send_json(HTTPStatus.OK, {"ok": True, "lead": lead})

    def api_csv(self) -> None:
        rows = self.server.store.rows()
        buffer = io.StringIO()
        writer = csv.writer(buffer)
        writer.writerow(
            [
                "id",
                "fecha",
                "nombre",
                "empresa",
                "correo",
                "pilar",
                "mensaje",
                "consentimiento",
                "estado",
                "email_estado",
                "origen",
            ]
        )
        for row in rows:
            writer.writerow(
                [
                    row["id"],
                    csv_safe(row["created_at"]),
                    csv_safe(row["nombre"]),
                    csv_safe(row["empresa"]),
                    csv_safe(row["correo"]),
                    csv_safe(row["pilar"]),
                    csv_safe(row["mensaje"].replace("\n", " ")),
                    "sí" if row["consentimiento"] else "no",
                    csv_safe(row["estado"]),
                    csv_safe(row["email_estado"]),
                    csv_safe(row["origen"]),
                ]
            )
        body = ("\ufeff" + buffer.getvalue()).encode("utf-8")
        filename = "leads-{}.csv".format(datetime.now().strftime("%Y%m%d-%H%M"))
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", "text/csv; charset=utf-8")
        self.send_header("Content-Disposition", 'attachment; filename="{}"'.format(filename))
        self.send_header("Content-Length", str(len(body)))
        self.common_headers()
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(body)

    def route_api(self) -> None:
        path = urlsplit(self.path).path
        method = self.command

        if path == "/api/health" and method in ("GET", "HEAD"):
            self.api_health()
            return
        if path == "/api/leads":
            if method == "GET":
                if self.require_admin():
                    self.api_list()
                return
            if method == "POST":
                self.api_create()
                return
            raise ApiError(405, "Método no permitido.")
        if path == "/api/leads.csv" and method in ("GET", "HEAD"):
            if self.require_admin():
                self.api_csv()
            return
        match = re.fullmatch(r"/api/leads/(\d+)", path)
        if match:
            if method != "PATCH":
                raise ApiError(405, "Método no permitido.")
            if self.require_admin():
                self.api_update(int(match.group(1)))
            return
        raise ApiError(404, "Ruta de API no encontrada.")

    def handle_api(self) -> None:
        try:
            self.route_api()
        except ApiError as error:
            self.send_error_json(error.status, error.message, error.fields)
        except Exception as error:  # noqa: BLE001
            print("[error] {}".format(error), file=sys.stderr)
            self.send_error_json(500, "Error interno del servidor.")

    # ------------------------------------------------------------------
    # Métodos HTTP
    # ------------------------------------------------------------------
    def do_GET(self) -> None:  # noqa: N802
        if urlsplit(self.path).path.startswith("/api/"):
            self.handle_api()
        else:
            self.serve_static()

    def do_HEAD(self) -> None:  # noqa: N802
        if urlsplit(self.path).path.startswith("/api/"):
            self.handle_api()
        else:
            self.serve_static()

    def do_POST(self) -> None:  # noqa: N802
        if urlsplit(self.path).path.startswith("/api/"):
            self.handle_api()
        else:
            self.send_error(HTTPStatus.METHOD_NOT_ALLOWED, "Método no permitido")

    def do_PATCH(self) -> None:  # noqa: N802
        if urlsplit(self.path).path.startswith("/api/"):
            self.handle_api()
        else:
            self.send_error(HTTPStatus.METHOD_NOT_ALLOWED, "Método no permitido")

    def log_message(self, format: str, *args) -> None:  # noqa: A003
        stamp = datetime.now().strftime("%H:%M:%S")
        print("[{}] {} {}".format(stamp, self.address_string(), format % args))


def main() -> int:
    parser = argparse.ArgumentParser(description="Servidor local de Innovainteligente")
    parser.add_argument("--host", default=os.environ.get("HOST", "127.0.0.1"), help="Interfaz de escucha")
    parser.add_argument("--port", type=int, default=int(os.environ.get("PORT", "8080")), help="Puerto HTTP")
    parser.add_argument(
        "--data-dir",
        default=os.environ.get("LEADS_DATA_DIR", str(DEFAULT_DATA_DIR)),
        help="Carpeta de datos (SQLite y JSON)",
    )
    args = parser.parse_args()

    store = LeadStore(Path(args.data_dir))
    server = AppServer((args.host, args.port), store)

    print("=" * 64)
    print(" Innovainteligente · servidor local")
    print("=" * 64)
    print(" Landing:   http://{}:{}/landing/".format(args.host, args.port))
    print(" Panel:     http://{}:{}/dashboard/".format(args.host, args.port))
    print(" API:       http://{}:{}/api/leads".format(args.host, args.port))
    print(" Datos:     {}".format(store.data_dir.resolve()))
    print(" SQLite:    {}".format(store.db_path.resolve()))
    print(" JSON:      {}".format(store.json_path.resolve()))
    print(
        " Correo:    {}".format(
            "SMTP configurado → {}".format(EMAIL_TO)
            if EMAIL_CONFIGURED
            else "sin SMTP (los leads se guardan y quedan 'pendiente_smtp')"
        )
    )
    if ADMIN_AUTH_REQUIRED and not DASHBOARD_PASSWORD:
        print(" Panel:     BLOQUEADO (define DASHBOARD_PASSWORD)")
    elif ADMIN_AUTH_REQUIRED:
        print(" Panel:     autenticación básica activa (usuario '{}')".format(DASHBOARD_USER))
    else:
        print(" Panel:     sin autenticación (solo desarrollo local)")
    print(" Entorno:   {}".format(APP_ENV))
    print("=" * 64)
    print("Ctrl+C para detener.")

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nDeteniendo servidor...")
    finally:
        server.server_close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
