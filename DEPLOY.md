# Despliegue con Docker y Dokploy

La imagen contiene tres piezas:

| Ruta | Contenido |
| --- | --- |
| `/landing/` | Landing pública y formulario |
| `/dashboard/` | Panel interno de leads (protegido con autenticación básica) |
| `/api/` | API del formulario y del panel |

El servidor escucha en el puerto **8080**, guarda los datos en **`/data`** (volumen) y solo
sirve `landing/` y `dashboard/`; no incluye el design system, la documentación ni el archivo
fuente interno.

## Archivos

| Archivo | Uso |
| --- | --- |
| [`Dockerfile`](Dockerfile) | Imagen de producción, usuario no root, healthcheck |
| [`docker-compose.yml`](docker-compose.yml) | Stack para local o Dokploy |
| [`.env.example`](.env.example) | Variables de entorno de ejemplo |
| [`.dockerignore`](.dockerignore) | Excluye documentación, originales y pruebas de la imagen |

## Opción A · Probar con Docker en local

```bash
cp .env.example .env
# edita .env: cambia DASHBOARD_PASSWORD antes de continuar
docker compose up -d --build
```

URLs:

- Landing: <http://127.0.0.1:8080/landing/>
- Panel: <http://127.0.0.1:8080/dashboard/> (el navegador pedirá usuario y contraseña)
- Salud: <http://127.0.0.1:8080/api/health>

Para detener:

```bash
docker compose down
```

Los datos se conservan en el volumen `innovainteligente_leads_data`. Para eliminarlos
(acción destructiva), `docker compose down -v`.

También puedes usar Docker directamente:

```bash
docker build -t innovainteligente .
docker run -d --name innovainteligente \
  -p 8080:8080 \
  -e DASHBOARD_PASSWORD='una-clave-larga' \
  -v innovainteligente_data:/data \
  innovainteligente
```

## Opción B · Dokploy (recomendado)

1. En Dokploy crea una **Application** y conecta el repositorio del proyecto.
2. **Build Type:** Dockerfile. Contexto: raíz del repositorio. Dockerfile: `Dockerfile`.
3. **Port:** `8080`.
4. **Environment:** define al menos `DASHBOARD_PASSWORD` (ver tabla). Añade SMTP si quieres
   avisos por correo.
5. **Volume:** monta un volumen persistente en **`/data`** (por ejemplo `leads-data`).
6. **Healthcheck:** ruta `/api/health`, puerto `8080`.
7. **Domain:** añade el dominio y activa HTTPS (Dokploy gestiona el certificado).
8. Deploy.

La raíz `/` redirige a `/landing/`. El panel está en `/dashboard/` y pide credenciales.

### Variables de entorno

| Variable | Obligatoria | Valor por defecto | Descripción |
| --- | --- | --- | --- |
| `DASHBOARD_PASSWORD` | **Sí en producción** | — | Contraseña del panel y de la API de administración |
| `DASHBOARD_USER` | No | `admin` | Usuario del panel |
| `LEADS_EMAIL_TO` | No | `javier@innovainteligente.com` | Destinatario de las notificaciones del formulario |
| `SMTP_HOST` | No | — | Servidor SMTP para enviar avisos |
| `SMTP_PORT` | No | `587` | Puerto SMTP |
| `SMTP_USER` | No | — | Usuario SMTP |
| `SMTP_PASSWORD` | No | — | Contraseña o clave de aplicación SMTP |
| `SMTP_FROM` | No | `SMTP_USER` o `no-reply@innovainteligente.com` | Remitente |
| `SMTP_TLS` | No | `1` | STARTTLS |
| `SMTP_SSL` | No | `0` | SSL directo |
| `APP_PORT` | No | `8080` | Puerto publicado en Docker Compose |

La imagen ya define `APP_ENV=production`, `HOST=0.0.0.0`, `PORT=8080` y
`LEADS_DATA_DIR=/data`.

> Si `APP_ENV=production` y no defines `DASHBOARD_PASSWORD`, el panel y la API de
> administración responden **503** y quedan bloqueados. La landing y el envío del
> formulario siguen funcionando.

### Opción con Docker Compose en Dokploy

También puedes crear la aplicación en modo **Docker Compose** usando este repositorio y
`docker-compose.yml`. Define `DASHBOARD_PASSWORD` en las variables del proyecto (Compose la
exige). Si Dokploy/Traefik gestiona el enrutamiento, ajusta o elimina el bloque `ports` y
mantén `expose: 8080` según la configuración del proxy.

## Autenticación

- La landing y `POST /api/leads` son **públicos** (el formulario debe funcionar).
- `/dashboard/` y toda su carpeta están protegidos con **HTTP Basic**.
- `GET /api/leads`, `PATCH /api/leads/{id}` y `GET /api/leads.csv` también están protegidos.
- `/api/health` es público y no devuelve datos internos.
- Sirve siempre por HTTPS en producción: la autenticación básica viaja en cada petición.

## Correo

El formulario siempre guarda el lead. Si configuras SMTP, además se envía un aviso a
`LEADS_EMAIL_TO` (por defecto `javier@innovainteligente.com`). Sin SMTP el lead queda como
`pendiente_smtp` y se consulta en el panel.

Para que los avisos salgan desde la cuenta de respuestas, configura `SMTP_USER` y
`SMTP_FROM` con `javier@innovainteligente.com`.

## Datos y respaldos

Los archivos persistentes están en el volumen:

- `/data/leads.sqlite3` — base de datos.
- `/data/leads.json` — espejo legible.

Respaldo con el contenedor detenido:

```bash
docker compose stop app
mkdir -p respaldos
docker run --rm -v innovainteligente_leads_data:/data -v "$PWD/respaldos":/backup \
  python:3.12-slim cp -a /data/leads.sqlite3 /data/leads.json /backup/
docker compose start app
```

Ajusta el nombre del volumen si usas Dokploy u otro compose. Restaurar es copiar los
archivos de vuelta al volumen con el contenedor detenido.

## Seguridad

- Contraseña larga y única para el panel; no la guardes en el repositorio (`.env` está
  ignorado).
- HTTPS obligatorio en el dominio.
- No publiques el puerto 8080 directamente si el proxy de Dokploy ya expone el servicio.
- El panel contiene datos personales: limita el acceso al equipo y aplica una política de
  conservación.
- Revisa los logs del contenedor: `docker compose logs -f app`.

## Problemas frecuentes

| Síntoma | Causa probable | Solución |
| --- | --- | --- |
| Panel responde 503 | `DASHBOARD_PASSWORD` vacía en producción | Define la variable y reinicia |
| Panel pide credenciales y no entra | Usuario o contraseña incorrectos | Revisa `DASHBOARD_USER` y `DASHBOARD_PASSWORD` |
| `/data` sin permisos | Volumen montado con otro propietario | Usa el volumen nombrado o ajusta permisos del bind mount |
| Correo pendiente | SMTP sin configurar o credenciales inválidas | Revisa `SMTP_*` y los logs |
| Healthcheck en `starting` | El contenedor acaba de arrancar | Espera el periodo inicial |
