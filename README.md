# Innovainteligente

Dos entregables independientes construidos a partir del logotipo original
`Logoinnovaintel150.png` (los archivos originales permanecen intactos en la raíz):

| Carpeta | Contenido |
| --- | --- |
| [`landing/`](landing/) | Landing page de producto, autocontenida |
| [`dashboard/`](dashboard/) | Panel interno de clientes y leads |
| [`server/`](server/) | Servidor local: API, SQLite/JSON y aviso por correo |
| [`design-system/`](design-system/) | Catálogo del sistema de diseño, tokens, componentes y documentación |

La landing por sí sola se puede abrir con doble clic. Para que el formulario registre
solicitudes hay que arrancar el servidor local.

## Ver las páginas

Para el flujo completo (formulario + panel de leads), con Docker:

```bash
cp .env.example .env
# cambia DASHBOARD_PASSWORD en .env
docker compose up -d --build
```

- **Landing:** <http://127.0.0.1:8080/landing/>
- **Panel de leads:** <http://127.0.0.1:8080/dashboard/> (usuario y contraseña)
- **API:** <http://127.0.0.1:8080/api/leads>

También puedes ejecutarlo sin Docker:

```bash
python3 server/app.py
```

El catálogo del design system se puede abrir como archivo con doble clic o con cualquier
servidor estático: `design-system/index.html`.

No hay dependencias externas ni conexión a internet. El servidor usa solo la biblioteca
estándar de Python.

## Docker y Dokploy

La landing y el panel están preparados para desplegarse con Docker:

- [`Dockerfile`](Dockerfile) e [`docker-compose.yml`](docker-compose.yml).
- Variables de entorno en [`.env.example`](.env.example).
- Guía paso a paso para Dokploy en [`DEPLOY.md`](DEPLOY.md).

La imagen solo incluye `landing/`, `dashboard/` y el servidor. El panel queda protegido con
autenticación básica cuando se define `DASHBOARD_PASSWORD`; el formulario sigue siendo
público.

## Landing

[`landing/index.html`](landing/index.html) presenta la oferta de automatización, procesos
e I+D+i con IA:

- Portada con la propuesta de valor y los tres pilares.
- Enfoque: optimización operativa inmediata, innovación a largo plazo y adopción ética.
- Fundamentos de I+D+i: definición, fórmula, fases e importancia.
- Los tres pilares de servicio con sus catorce servicios.
- Ruta de adopción, preguntas frecuentes y formulario de contacto.
- Tema oscuro y claro, menú móvil, pestañas accesibles y validación de formulario.
- El formulario registra la solicitud en el servidor local. Las respuestas se gestionan
  desde `javier@innovainteligente.com`.
- Para contacto directo, la landing ofrece `info@innovainteligente.com`, WhatsApp y
  Telegram, con enlaces desde la landing.

La carpeta es autocontenida: incluye sus propias hojas de estilo, JavaScript, fuentes,
favicons y marca. Puede publicarse sola; sin el servidor, el formulario cae en el enlace
de correo.

## Panel de leads y servidor

[`server/app.py`](server/app.py) sirve la landing y el panel, y guarda cada solicitud en:

- `server/data/leads.sqlite3` (SQLite, fuente de verdad).
- `server/data/leads.json` (espejo legible).

El panel permite buscar, filtrar por estado o pilar, abrir el detalle del lead, cambiar su
estado (`nuevo`, `contactado`, `descartado`) y exportar a CSV. También muestra si el aviso
por correo se envió o quedó pendiente.

El aviso por correo a `javier@innovainteligente.com` se activa configurando SMTP. Sin
SMTP los leads se guardan igualmente y quedan marcados como `pendiente_smtp`. Instrucciones
completas en [`server/README.md`](server/README.md).

> El panel y la API escuchan en `127.0.0.1` y no tienen autenticación: son de uso local.
> No los publiques sin protegerlos.

**Cuentas:** las notificaciones del formulario llegan a `javier@innovainteligente.com`
(configurable con `LEADS_EMAIL_TO`). El contacto directo publicado es
`info@innovainteligente.com`; WhatsApp y Telegram se abren desde los iconos de la landing.

## Design system

[`design-system/index.html`](design-system/index.html) es el catálogo interactivo del
sistema:

- 191 tokens de color, tipografía, espacio, forma, elevación y movimiento.
- 60 iconos SVG y 18 secciones con 50 demos de componentes.
- Contraste WCAG 2.1 AA calculado en vivo, foco visible, teclado completo y
  `prefers-reduced-motion`.
- Explorador de tokens con filtro, copiado y descarga en JSON.

Documentación en [`design-system/docs/`](design-system/docs/):

- [Sistema de diseño](design-system/docs/design-system.md)
- [Paleta y contraste](design-system/docs/paleta-y-contraste.md)
- [Checklist de accesibilidad](design-system/docs/accesibilidad.md)
- [Revisión visual y funcional](design-system/docs/revision-qa-visual.md)
- [Tokens en JSON](design-system/docs/tokens.json)

## Estructura

```text
.
├── landing/
│   ├── index.html
│   ├── css/            fonts.css · tokens.css · components.css · landing.css
│   ├── js/             landing-theme-init.js · landing.js
│   └── assets/         marca y fuentes autoalojadas
├── dashboard/          panel interno (HTML, CSS y JS propios)
├── server/
│   ├── app.py          servidor estático + API + SQLite/JSON + SMTP opcional
│   └── data/           leads.sqlite3 · leads.json
├── design-system/
│   ├── index.html
│   ├── css/            fonts.css · tokens.css · components.css · showcase.css
│   ├── js/             theme-init.js · app.js
│   ├── assets/         marca completa y fuentes
│   └── docs/           documentación, tokens.json y capturas
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── .env.example
├── DEPLOY.md                  Guía de Docker y Dokploy
├── Logoinnovaintel150.png     Original (sin modificar)
├── Logoinnovaintel.png        Original en alta resolución (sin modificar)
└── Revisar/                   Artefactos de prueba y versiones previas conservadas
```

## Uso

La landing y el catálogo comparten el lenguaje visual y los tokens, pero se sirven por
separado. Para reutilizar componentes en otro proyecto, toma como referencia
`design-system/css/tokens.css` y `design-system/css/components.css`.

## Licencias

Logotipo y marca: innovainteligente.com. Poppins e Inter: SIL Open Font License 1.1
(ver [`design-system/assets/fonts/LICENCIAS.md`](design-system/assets/fonts/LICENCIAS.md)).
El resto del código es propio del proyecto.
