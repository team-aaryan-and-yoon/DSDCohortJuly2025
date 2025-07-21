FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

RUN curl -LsSf https://astral.sh/uv/install.sh | sh && \
    mv /root/.local/bin/uv /usr/local/bin/uv && \
    mv /root/.local/bin/uvx /usr/local/bin/uvx
COPY . .

RUN uv venv && uv sync --no-cache

RUN groupadd -r django && \
    useradd --no-log-init -r -g django django && \
    chown -R django:django /app

USER django

EXPOSE 8000

CMD ["sh", "-c", "uv run python manage.py collectstatic --noinput && uv run uvicorn core.asgi:application --host 0.0.0.0 --port 8000 --reload"]
