# Overview

Guardar en: `.quinoto-spec/discovery/02-overview.md`

**Discovery Date:** 2026-11-08

## Resumen ejecutivo

**Quinoto Software Factory** es una aplicación web self-hosted y open source que orquesta el ciclo
de vida de un proyecto de software usando OpenCode como motor de agentes y QuinotoSpec como sistema
de artefactos y reglas. El usuario conecta un repositorio de GitHub, elige un objetivo y la app
ejecuta el workflow discovery → propuesta → user stories → tareas → implementación con agentes,
muestra los logs en vivo y entrega el resultado como Pull Request. Opcionalmente publica la app en
Railway.

Estado del repositorio: **MVP v1 completo (F0–F6)**. La propuesta `SWFC-f4c2` fue aprobada,
implementada, verificada y archivada. Los 7 delta specs se mergearon en `.quinoto-spec/specs/`.

## Qué incluye la v1

- Conexión de GitHub App (manifest flow), selección de repos y creación de proyectos.
- Workflow con etapas, gates y aprobaciones humanas.
- Sesiones de agente en runners efímeros, con logs SSE, cancelación y timeout.
- Revisión de diff y apertura de Pull Requests.
- Vínculo con Railway, deploy y estado.
- Dashboard multi-proyecto.
- Auditoría append-only y redacción de secretos.
- Instalación self-hosted con Docker Compose.

## Estructura del repositorio

```text
apps/
  web/        Next.js 15: dashboard, proyectos, aprobaciones, sesiones
  api/        Fastify 5: REST, SSE, webhooks
  worker/     esqueleto del worker
packages/
  core/       dominio, config, crypto, workflow, redacción
  db/         schema Drizzle, repositorios, migraciones
  adapters-github/
  adapters-railway/
  ui/
infra/        Compose, Dockerfiles y runner
docs/         operación y release checklist
.quinoto-spec/ PRD, specs, changelog, discovery
```

## Archivos de entrada

- API: `apps/api/src/server.ts` → `buildServer()` y `start()`.
- Web: `apps/web/app/page.tsx` (dashboard) y rutas en `apps/web/app/**`.
- Worker: `apps/worker/src/index.ts` (esqueleto).
- Migraciones: `packages/db/drizzle/` y `packages/db/src/migrate.ts`.

## Comandos básicos

```bash
pnpm install
pnpm dev
pnpm test
pnpm build
docker compose -f infra/docker-compose.yml up -d --build
```

- Web local: http://localhost:3000
- API local: http://localhost:4000
- Health: `GET /healthz` · Readiness: `GET /readyz`

## Riesgos y puntos críticos

1. **Credenciales reales:** GitHub App, Railway y LLM requieren configuración; sin ellas se usan mocks o el flujo queda incompleto.
2. **URL pública:** los webhooks de GitHub necesitan `FACTORY_BASE_URL` accesible desde internet.
3. **Cola pendiente:** el worker no consume trabajos todavía; el orquestador corre en el proceso de la API.
4. **Sin auth local:** la instancia asume un operador único; no hay RBAC.
5. **Sin E2E de navegador:** la UI se valida por build y pruebas de API.

## Alcance del discovery

| Archivo | Estado |
|---|---|
| 01-stack-profile.md | Completo |
| 02-overview.md | Completo |
| 03-architecture.md | Completo |
| 04-endpoints-and-openapi.md | Completo |
| 05-data-and-services.md | Completo |
| 06-devops-ci-security.md | Completo |
| 07-findings-and-recommendations.md | Completo |
| 08-product-and-agreements.md | Completo |
