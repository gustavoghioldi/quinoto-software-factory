# Stack Profile

Guardar en: `.quinoto-spec/discovery/01-stack-profile.md`

**Discovery Date:** 2026-11-08
**Proyecto:** Quinoto Software Factory
**Estado:** MVP v1 completo (F0–F6)

## Resumen

Monorepo TypeScript con arquitectura de puertos y adaptadores. La UI es Next.js 15, la API es
Fastify 5, la persistencia es PostgreSQL 16 con Drizzle ORM y la infraestructura local se levanta
con Docker Compose. Los agentes se ejecutan en un runner separado (OpenCode) y las integraciones
externas viven en paquetes de adaptadores aislados.

## Identificación del stack

| Área | Tecnología | Versión |
|---|---|---|
| Lenguaje | TypeScript (ESM, strict) | 5.9 |
| Runtime | Node.js | ≥ 22 (local: 26) |
| Package manager | pnpm | 10.28.1 |
| Monorepo | pnpm workspaces + Turborepo | Turbo 2.11 |
| Web | Next.js (App Router) + React | 15.5 / 19 |
| API | Fastify + @fastify/cors | 5.x / 10.x |
| Validación | Zod | 3.24 |
| Base de datos | PostgreSQL | 16 |
| ORM / migraciones | Drizzle ORM + drizzle-kit | 0.38 / 0.30 |
| Cola | Redis (reservada; BullMQ aún no implementado) | 7 |
| Testing | Vitest | 3.2 |
| Lint | ESLint flat config + typescript-eslint | 9 / 8 |
| Formato | Prettier | 3.9 |
| Criptografía | Node `crypto` (AES-256-GCM) | nativa |
| Contenedores | Docker + Docker Compose | 28 / v2 |
| CI | GitHub Actions | `quality` |

## Estructura del monorepo

```text
apps/
  web/                  Next.js 15 (App Router)
  api/                  Fastify 5 (REST + SSE)
  worker/               esqueleto del worker (sin cola todavía)
packages/
  core/                 dominio, config, crypto, workflow, redaction
  db/                   schema Drizzle, repositorios y migraciones
  adapters-github/      GitHub App, JWT, tokens, repos, PRs, webhooks
  adapters-railway/     runners efímeros y deploys
  ui/                   utilidades compartidas de UI
infra/
  docker-compose.yml
  api.Dockerfile / web.Dockerfile / worker.Dockerfile
  runner/               imagen factory-runner (OpenCode)
```

## Comandos

```bash
# Instalar
pnpm install

# Desarrollo (web + api + worker)
pnpm dev

# Calidad
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm format:check

# Base de datos
pnpm --filter @factory/db db:generate
pnpm --filter @factory/db db:migrate

# Stack completo
docker compose -f infra/docker-compose.yml up -d --build
./scripts/smoke-compose.sh
```

## Coding standards detectados

- TypeScript estricto con `noUncheckedIndexedAccess`, `noImplicitOverride` y `verbatimModuleSyntax`.
- ESM en todos los paquetes; imports relativos con extensión `.js`.
- Separación por capas: dominio (`core`), persistencia (`db`), adaptadores (`adapters-*`), transporte (`api`).
- Inyección de dependencias explícita (`ApiDependencies`, `createAgentRuntime`, `createWorkflowService`).
- Validación de entorno con Zod al arrancar (`loadConfig`).
- Errores tipados por dominio (`WorkflowError`, `SessionError`, `GitHubApiError`, `RailwayApiError`, `CryptoError`).
- Tests colocados junto al código (`*.test.ts`) y tests de API en `apps/api/tests/`.

## Testing

- **Framework:** Vitest 3.
- **Archivos de test:** 26.
- **Tests:** 102 (core 35, adapters-github 17, adapters-railway 7, api 43).
- **Tipos:** unitarios de dominio, unitarios de adaptadores con `fetch` inyectado y tests de integración de API con Fastify `inject` y repositorios en memoria.
- **Pendiente:** tests E2E con Playwright y tests de integración con Testcontainers contra Postgres/Redis reales.

## Riesgos del stack

| Riesgo | Impacto | Nota |
|---|---|---|
| La cola BullMQ/Redis está reservada pero no implementada | Medio | El worker es un esqueleto; el orquestador corre en la API. |
| Next.js 15 y React 19 son recientes | Bajo | Build y tests pasan; vigilar breaking changes. |
| El cliente GraphQL de Railway puede requerir ajustes de schema | Medio | Validar con un token real. |
| Sin tests E2E de navegador | Medio | Los flujos se cubren por API, no por UI real. |
