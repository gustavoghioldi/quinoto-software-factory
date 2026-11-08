# Quinoto Software Factory

Aplicación web **self-hosted y open source** que orquesta
[OpenCode](https://opencode.ai) + [QuinotoSpec](https://github.com/Quinoto-Tech/QuinotoSpec)
desde una UI: conectás un repositorio de GitHub, corrés el workflow
discovery → propuesta → user stories → tareas → apply con agentes, ves los logs en vivo y
entregás cada cambio como un Pull Request. Opcionalmente deploya en Railway.

> Estado: **F0 — fundaciones**. El esqueleto del monorepo, la API, la UI, el worker y la
> infraestructura base están en construcción. Las funcionalidades de producto llegan en F1+.

## Stack

- **Monorepo:** pnpm workspaces + Turborepo + TypeScript estricto.
- **Web:** Next.js 15 (App Router) + React 19.
- **API:** Fastify 5 + SSE.
- **Worker:** Node.js (BullMQ/Redis en F2).
- **Datos:** PostgreSQL 16 (F1+).
- **Infra local:** Docker Compose.

## Requisitos

- Node.js 22+
- pnpm 10+
- Docker + Docker Compose (para el stack completo)

## Desarrollo

```bash
pnpm install
cp .env.example .env
pnpm dev          # web en :3000, api en :4000
```

## Calidad

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Self-hosted

```bash
cp .env.example .env
# completar FACTORY_MASTER_KEY y credenciales
docker compose -f infra/docker-compose.yml up -d --build
```

Verificar:

```bash
curl http://localhost:4000/healthz
curl http://localhost:4000/readyz
```

Smoke test completo:

```bash
./scripts/smoke-compose.sh
```

## Estructura

```text
apps/
  web/       Next.js
  api/       Fastify
  worker/    orquestador (F2)
packages/
  core/      dominio, configuración y errores
  ui/        utilidades de UI compartidas
infra/       Docker Compose y Dockerfiles
.quinoto-spec/  PRD, propuesta, specs y tareas
```

## Documentación del proyecto

- PRD: `.quinoto-spec/prd/quinoto-software-factory/prd.md`
- Propuesta: `.quinoto-spec/proposals/2026-11-08-quinoto-software-factory-mvp/proposal.md`
- Design: `.quinoto-spec/proposals/2026-11-08-quinoto-software-factory-mvp/design.md`
- User stories y tareas: misma carpeta de propuesta.
