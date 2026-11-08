---
date: 2026-11-08
prefix: SWFC-f4c2
slug: f0-implemented
format: v2
type: change
---

## [2026-11-08] - F0 Implemented: Quinoto Software Factory Foundations

### Resumen
- Se implementó el monorepo pnpm + Turborepo con TypeScript estricto, ESLint y Prettier.
- Se crearon `packages/core` (configuración Zod y errores), `packages/ui`, `apps/api` (Fastify con `/healthz` y `/readyz`), `apps/web` (Next.js 15) y `apps/worker`.
- Se agregó CI de GitHub Actions, guía de branch protection, Docker Compose con Postgres/Redis, Dockerfiles por servicio y `scripts/smoke-compose.sh`.
- Verificación: `pnpm lint`, `pnpm typecheck`, `pnpm test` (10 tests), `pnpm build`, `pnpm format:check` y smoke test de Compose (`compose stack is ready`).
- Bug corregido: `FACTORY_MASTER_KEY=""` fallaba la validación de mínimo 32; ahora los strings vacíos opcionales se normalizan a `undefined` y hay test de regresión.
- Tareas F0: 12/15 completadas. `TSK-005`, `TSK-006` y `TSK-007` quedan pendientes de un remoto en GitHub para ejecutar Actions y branch protection.

**Tiempo Ahorrado**: ~16h (IA: 35m vs Humano: 16h)
