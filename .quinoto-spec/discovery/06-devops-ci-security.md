# DevOps, CI & Security

Guardar en: `.quinoto-spec/discovery/06-devops-ci-security.md`

**Discovery Date:** 2026-11-08

## Entorno de desarrollo

- Node.js ≥ 22 y pnpm 10.28.1.
- Docker + Docker Compose para el stack completo.
- Variables en `.env` (copiar desde `.env.example`).

## Variables de entorno

| Variable | Obligatoria | Descripción |
|---|---|---|
| `NODE_ENV` | No | `development`/`test`/`production`. |
| `PORT` | No | Puerto de la API (default 4000). |
| `DATABASE_URL` | Sí en producción | PostgreSQL. |
| `REDIS_URL` | Sí en producción | Redis. |
| `FACTORY_MASTER_KEY` | Sí en producción | 32 bytes base64 para cifrar secretos. |
| `FACTORY_BASE_URL` | Sí con GitHub real | URL pública para webhooks y manifest. |
| `GITHUB_APP_NAME` | No | Nombre de la app. |
| `GITHUB_APP_ID` / `GITHUB_PRIVATE_KEY` / `GITHUB_WEBHOOK_SECRET` | Sí con GitHub real | Credenciales de la app. |
| `RAILWAY_API_TOKEN` | No | Si falta, se usa el mock. |
| `RAILWAY_RUNNER_IMAGE` | No | Imagen del runner. |
| `OPENCODE_MODEL_API_KEY` | Sí para sesiones reales | LLM del agente. |
| `MAX_SESSION_MINUTES` | No | Default 30. |
| `MAX_SESSIONS_PER_PROJECT` | No | Default 1. |
| `CORS_ORIGINS` | No | Orígenes permitidos. |
| `TELEMETRY_ENABLED` | No | Default `false`. |

## CI/CD

- **GitHub Actions:** `.github/workflows/ci.yml`, job `quality`.
- Pasos: checkout → pnpm → Node 22 → install → lint → typecheck → test → build.
- **Branch protection:** `main` requiere el check `quality`, strict, `enforce_admins=true`, sin force push ni deletions.
- **Entrega:** todo cambio pasa por branch + PR; nunca push directo a `main`.

## Docker Compose

Servicios: `postgres`, `redis`, `migrate`, `api`, `web`, `worker`.
- `migrate` aplica migraciones antes de que arranque la API.
- `api` y `web` exponen 4000 y 3000.
- `worker` es un esqueleto; no consume cola todavía.
- Volúmenes: `pgdata`, `redisdata`.

## Dockerfiles

- `infra/api.Dockerfile`: build multi-stage con pnpm, runtime `node:22-alpine`.
- `infra/web.Dockerfile`: build de Next.js, runtime con `pnpm start`.
- `infra/worker.Dockerfile`: build del worker.
- `infra/runner/Dockerfile`: `node:22-bookworm-slim` + git + Python + OpenCode, usuario no root, healthcheck.

## Seguridad implementada

- **Cifrado en reposo:** tokens, private key y webhook secret con AES-256-GCM (`FACTORY_MASTER_KEY`).
- **Redacción:** `redactValue` tapa tokens en eventos de sesión y auditoría.
- **Auditoría:** tabla append-only `audit_entries` para aprobaciones, PRs, deploys y cancelaciones.
- **Aislamiento:** un contenedor por sesión, sin acceso al host.
- **Permisos mínimos:** GitHub App con `contents`, `pull_requests`, `metadata`.
- **Webhooks:** firma HMAC SHA-256 obligatoria.
- **Telemetría:** deshabilitada por defecto.
- **Secretos:** nunca en logs ni en el repositorio; `.env` ignorado por git.
- **Rama principal:** protegida; la app solo abre PRs.

## Auditoría de dependencias

```bash
pnpm audit
./scripts/license-audit.sh
```

- `license-audit.sh` falla ante SSPL, BUSL, UNLICENSED o Commons Clause.
- Última ejecución: `License audit passed`.

## Backup y recuperación

```bash
# Backup
docker compose -f infra/docker-compose.yml exec -T postgres \
  pg_dump -U factory -d factory -Fc > backup-$(date +%Y%m%d).dump

# Restore
docker compose -f infra/docker-compose.yml stop api worker
docker compose -f infra/docker-compose.yml exec -T postgres \
  pg_restore -U factory -d factory --clean --if-exists < backup-YYYYMMDD.dump
docker compose -f infra/docker-compose.yml start api worker
```

## Deploy

- La app se despliega con Docker Compose en el host del operador.
- Los agentes y las apps resultantes se despliegan en Railway (opcional).
- `FACTORY_BASE_URL` debe ser pública para webhooks.

## Riesgos de seguridad y operación

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Sin auth local ni RBAC | Alto en equipos | Asumir operador único; agregar auth en v2. |
| Master key perdida | Alto | Documentar rotación y reconexión de integraciones. |
| Token de Railway con permisos amplios | Medio | Usar token acotado al proyecto. |
| Webhooks expuestos | Medio | Validar firma y usar HTTPS. |
| Sin rate limiting | Medio | Agregar límites en API y webhooks. |
| Dependencias de terceros | Medio | `pnpm audit` + license audit en CI. |
