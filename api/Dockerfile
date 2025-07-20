# pull the official base image
FROM python:3.13-slim

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# set work directory
WORKDIR /app

# install system dependencies
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# install uv to a global path
RUN curl -LsSf https://astral.sh/uv/install.sh | sh && \
    mv /root/.local/bin/uv /usr/local/bin/uv && \
    mv /root/.local/bin/uvx /usr/local/bin/uvx

# --- This is the new, robust setup ---

# 1. Copy all project files first
COPY . .

# 2. Install dependencies as root, which has permission to write to /app
RUN uv venv && uv sync --no-cache

# 3. NOW, create the non-root user and give it ownership of EVERYTHING.
#    This includes the .venv and all your project files.
RUN groupadd -r django && \
    useradd --no-log-init -r -g django django && \
    chown -R django:django /app

# 4. Switch to the non-root user for the final running process
USER django

# Expose the port
EXPOSE 8000