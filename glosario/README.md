# Glosario interactivo · IA y Automatización

Versión web interactiva del `glosario-ia-y-automatizacion.md`, con el sistema de
diseño de **innovainteligente.com** (tokens de marca, Poppins/Inter autoalojadas,
tema oscuro/claro, hexágonos y acentos cian).

## Abrir

Es 100 % estático: basta con abrir `index.html` en el navegador, o servirlo:

```bash
python3 -m http.server 8080   # → http://localhost:8080
```

## Funciones

- Búsqueda instantánea (insensible a tildes, resalta coincidencias, autodespliega resultados). Atajo: `/` para buscar, `Esc` para limpiar.
- Índice alfabético A–Z con conteos (filtro por letra).
- Fichas acordeón: definición siempre visible; *Qué hace / Para qué sirve / Diferencia clave* al expandir.
- Expandir/colapsar todo, enlace copiable por concepto (deep links `#slug`).
- Tema claro/oscuro compartido con la landing (`localStorage: innovainteligente-theme`).
- Sin dependencias de red: fuentes y logo autoalojados, sin CDN.

## Estructura

```
index.html          plantilla y sprite de iconos
css/tokens.css      copia fiel de los tokens de la landing (fuente única de verdad)
css/fonts.css       Poppins + Inter autoalojadas
css/glosario.css    estilos de la herramienta (usa solo tokens)
js/data.js          69 conceptos, GENERADO — no editar a mano
js/app.js           render, búsqueda, acordeón, tema
js/theme-init.js    aplica el tema antes del primer pintado
assets/             logo y fuentes del sitio
```

## Regenerar los datos

Si cambia el markdown (`~/Documentos/Notas/glosario-ia-y-automatizacion.md`):

```bash
python3 js/parse_glosario.py   # o la copia en /tmp   # regenera js/data.js
```

(convierte `**negrita**`, `*cursiva*` y `` `código` `` a HTML en el proceso).

## Desplegar en el VPS

Copiar la carpeta tal cual a cualquier ruta servida por Traefik/Nginx, p. ej.
`https://innovainteligente.com/glosario/` o un subdominio de prueba.
