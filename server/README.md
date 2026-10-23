# Servidor local de leads

Servicio mínimo en Python (solo biblioteca estándar) que sirve la landing, el panel
de leads y una API para guardar las solicitudes del formulario.

## Arranque

```bash
python3 server/app.py
# http://127.0.0.1:8080/landing/
# http://127.0.0.1:8080/dashboard/
```

Opciones:

```bash
python3 server/app.py --host 127.0.0.1 --port 8080 --data-dir server/data
```

Sin dependencias externas. Requiere Python 3.10 o superior.

Para desplegar con Docker o Dokploy, consulta [`../DEPLOY.md`](../DEPLOY.md).

## Datos

| Archivo | Uso |
| --- | --- |
| `server/data/leads.sqlite3` | Base de datos SQLite (fuente de verdad) |
| `server/data/leads.json` | Espejo legible de todos los leads |

- El SQLite se crea automáticamente al arrancar.
- El JSON se reescribe tras cada alta o cambio de estado.
- Para respaldar: copia ambos archivos con el servidor detenido.
- Para empezar de cero: mueve los dos archivos a `Revisar/` y arranca de nuevo.

## Correo de aviso

El formulario guarda siempre el lead. Para enviar además un correo a la recepción,
configura SMTP antes de arrancar. La recepción de los formularios es
`javier@innovainteligente.com`; el contacto directo publicado es
`info@innovainteligente.com`. Los canales de WhatsApp y Telegram se abren desde la landing.

```bash
export SMTP_HOST="smtp.ejemplo.com"
export SMTP_PORT="587"
export SMTP_USER="usuario@ejemplo.com"
export SMTP_PASSWORD="clave"
export SMTP_FROM="no-reply@innovainteligente.com"
export LEADS_EMAIL_TO="javier@innovainteligente.com"   # valor por defecto
python3 server/app.py
```

- `SMTP_TLS=0` desactiva STARTTLS; `SMTP_SSL=1` usa SSL directo.
- Sin SMTP, el lead se guarda con `email_estado = pendiente_smtp` y el panel lo muestra.
- Si el envío falla, el lead se conserva con `email_estado = error`; el detalle del panel
  indica el estado.
- Para que los avisos salgan desde `javier@innovainteligente.com`, configura
  `SMTP_USER` y `SMTP_FROM` con esa cuenta. La cuenta pública de contacto directo es
  `info@innovainteligente.com` y no necesita configuración en el servidor.

## API

| Método | Ruta | Uso |
| --- | --- | --- |
| GET | `/api/health` | Estado del servicio y configuración de correo |
| GET | `/api/leads` | Lista de leads y estadísticas |
| POST | `/api/leads` | Alta de una solicitud |
| PATCH | `/api/leads/{id}` | Cambio de estado (`nuevo`, `contactado`, `descartado`) |
| GET | `/api/leads.csv` | Exportación CSV compatible con Excel |

Ejemplo de alta:

```bash
curl -X POST http://127.0.0.1:8080/api/leads \
  -H 'Content-Type: application/json' \
  -d '{"nombre":"Ana Pérez","empresa":"ACME","correo":"ana@acme.com","pilar":"Investigación, desarrollo e innovación","mensaje":"Quiero validar una prueba de concepto.","consentimiento":true}'
```

El servidor valida tipos, longitudes, correo, pilar y consentimiento; limita el cuerpo a
32 KB y no expone CORS.

## Seguridad y autenticación

- Escucha en `127.0.0.1` por defecto: no es accesible desde la red local ni Internet.
- Con `APP_ENV=production` el panel exige autenticación básica. Define
  `DASHBOARD_PASSWORD` (y opcionalmente `DASHBOARD_USER`, por defecto `admin`).
  Sin contraseña, el panel y la API de administración responden 503.
- La landing y `POST /api/leads` son públicos para que el formulario funcione.
- `/api/health` es público y no devuelve datos internos.
- Solo se sirven las carpetas `landing/` y `dashboard/`; el resto del proyecto
  (documentación, design system, fuentes internas) no se expone por HTTP.
- Los datos personales de los leads quedan en este equipo. Aplica tus políticas de
  privacidad y conservación.
