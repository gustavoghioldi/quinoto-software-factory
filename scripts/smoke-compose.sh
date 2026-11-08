#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

compose_file="infra/docker-compose.yml"

cleanup() {
  docker compose -f "$compose_file" down -v --remove-orphans
}
trap cleanup EXIT

docker compose -f "$compose_file" up -d --build

for _ in $(seq 1 90); do
  if curl -fsS http://localhost:4000/readyz >/dev/null 2>&1; then
    echo "compose stack is ready"
    exit 0
  fi
  sleep 2
done

echo "compose stack did not become ready in time" >&2
docker compose -f "$compose_file" ps >&2
exit 1
