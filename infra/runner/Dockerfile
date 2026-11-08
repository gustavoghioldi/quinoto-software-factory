FROM node:22-bookworm-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends git ca-certificates curl python3 python3-pip \
    && rm -rf /var/lib/apt/lists/*

RUN corepack enable && npm install -g opencode-ai@latest

COPY healthcheck.sh /usr/local/bin/healthcheck.sh
RUN chmod +x /usr/local/bin/healthcheck.sh

RUN useradd --create-home --shell /bin/bash runner
USER runner
WORKDIR /home/runner

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD ["/usr/local/bin/healthcheck.sh"]

CMD ["opencode", "serve", "--hostname", "0.0.0.0", "--port", "4096"]
