#!/usr/bin/env python3
"""Parsea glosario-ia-y-automatizacion.md y genera js/data.js para el sitio interactivo."""
import json
import re
import sys

SRC = "/home/javx/Documentos/Notas/glosario-ia-y-automatizacion.md"
OUT = "/home/javx/Documentos/VPSContabo/glosario/js/data.js"

def md_to_html(text: str) -> str:
    """Markdown-lite a HTML: **bold**, *em*, `code`."""
    text = text.strip()
    # escapar HTML básico
    text = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    # code
    text = re.sub(r"`([^`]+)`", r"<code>\1</code>", text)
    # bold antes que em
    text = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", text)
    # em (evita ** ya consumidos)
    text = re.sub(r"(?<!\*)\*([^*\n]+)\*(?!\*)", r"<em>\1</em>", text)
    return text

def main():
    lines = open(SRC, encoding="utf-8").read().splitlines()

    # saltar frontmatter
    i = 0
    if lines[0].strip() == "---":
        j = lines.index("---", 1)
        i = j + 1

    letter = None
    entries = []
    cur = None
    mode = None  # 'body' | 'bullets'

    def close():
        nonlocal cur
        if cur is not None:
            entries.append(cur)
            cur = None

    bold_line = re.compile(r"^\*\*(.+?)\*\*(?:\s*\*(\([^*]+\))\*)?\s*$")
    bullet = re.compile(r"^-\s+\*\*([^:]+?):\*\*\s*(.*)$")
    bullet_plain = re.compile(r"^-\s+(.*)$")

    while i < len(lines):
        raw = lines[i].rstrip()
        line = raw.strip()
        i += 1

        if not line:
            continue

        m = re.match(r"^###\s+(.+)$", line)
        if m:
            close()
            label = m.group(1).strip()
            mm = re.match(r"[A-ZÁÉÍÓÚ]", label)
            letter = mm.group(0) if mm else label
            continue

        if line == "---":
            close()
            continue

        if line.startswith("# "):  # título principal / intro
            close()
            continue

        mb = bold_line.match(line)
        if mb:
            close()
            term = mb.group(1).strip()
            note = (mb.group(2) or "").strip().strip("*() ").strip()
            # redirect tipo "OCR (véase M: ...)"
            mr = re.match(r"^(.+?)\s*\(véase\s+(.+?)\)$", term)
            if mr:
                entries.append({
                    "letter": letter,
                    "term": mr.group(1).strip(),
                    "note": "",
                    "redirect": mr.group(2).strip(),
                    "definition": "",
                    "fields": [],
                })
                cur = None
                continue
            cur = {"letter": letter, "term": term, "note": note,
                   "definition": "", "fields": []}
            mode = "body"
            continue

        if cur is None:
            # párrafo introductorio global u otros: ignorar
            continue

        mbl = bullet.match(line)
        if mbl:
            label = mbl.group(1).strip()
            body = mbl.group(2).strip()
            # continuaciones (líneas siguientes no vacías que no inician nuevo bloque)
            while i < len(lines):
                nxt = lines[i].strip()
                if (not nxt or nxt.startswith("-") or nxt.startswith("**")
                        or nxt.startswith("###") or nxt == "---" or nxt.startswith("#")):
                    break
                body += " " + nxt
                i += 1
            cur["fields"].append({"label": md_to_html(label),
                                  "text": md_to_html(body)})
            mode = "bullets"
            continue

        mbp = bullet_plain.match(line)
        if mbp and mode is not None:
            cur["fields"].append({"label": "", "text": md_to_html(mbp.group(1))})
            continue

        # línea de definición (o continuación de definición)
        body = line
        while i < len(lines):
            nxt = lines[i].strip()
            if (not nxt or nxt.startswith("-") or nxt.startswith("**")
                    or nxt.startswith("###") or nxt == "---" or nxt.startswith("#")):
                break
            body += " " + nxt
            i += 1
        if mode == "body":
            cur["definition"] = (cur["definition"] + " " + md_to_html(body)).strip()
        else:
            # continuación tras bullets sin separador: anexar a definición
            cur["definition"] = (cur["definition"] + " " + md_to_html(body)).strip()

    close()

    # depurar entradas vacías
    entries = [e for e in entries if e["term"]]

    data = {
        "title": "Glosario interactivo de IA, I+D+i y Automatización",
        "author": "Prof. Javier Rodríguez",
        "source": "glosario-ia-y-automatizacion.md",
        "entries": entries,
    }

    with open(OUT, "w", encoding="utf-8") as f:
        f.write("/* Generado automáticamente desde el glosario .md — no editar a mano.\n   Fuente: Documentos/Notas/glosario-ia-y-automatizacion.md\n*/\n")
        f.write("window.GLOSARIO = ")
        f.write(json.dumps(data, ensure_ascii=False, separators=(",", ":")))
        f.write(";\n")

    letters = {}
    for e in entries:
        letters.setdefault(e["letter"], 0)
        letters[e["letter"]] += 1
    print(f"{len(entries)} entradas, secciones: {letters}", file=sys.stderr)
    redirects = [e["term"] for e in entries if e.get("redirect")]
    print(f"redirects: {redirects}", file=sys.stderr)

if __name__ == "__main__":
    main()
