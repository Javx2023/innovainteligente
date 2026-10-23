# Innovainteligente · landing + panel de leads + API
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    APP_ENV=production \
    HOST=0.0.0.0 \
    PORT=8080 \
    LEADS_DATA_DIR=/data

WORKDIR /app

RUN groupadd --system app \
    && useradd --system --gid app --home-dir /app --no-create-home app \
    && mkdir -p /data \
    && chown app:app /data

COPY --chown=app:app server/app.py ./server/app.py
COPY --chown=app:app landing ./landing
COPY --chown=app:app dashboard ./dashboard

USER app

EXPOSE 8080
VOLUME ["/data"]

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD ["python", "-c", "import urllib.request,sys; sys.exit(0 if urllib.request.urlopen('http://127.0.0.1:8080/api/health', timeout=3).status == 200 else 1)"]

CMD ["python", "server/app.py"]
