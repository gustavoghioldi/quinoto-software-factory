# Plan de Tareas (Quinoto Software Factory MVP — Fase F0)

**Proposal ID:** 2026-11-08-quinoto-software-factory-mvp
**Prefijo:** SWFC-f4c2
**Estado:** proposed

> Índice consolidado de la fase F0. Las tareas de F1+ se generan al cerrar esta fase.

| ID | Tipo | Título | Descripción | Historia Relacionada | Servicio | Archivos a Modificar | Estimación | Prioridad | Dependencias | Estado |
|---|---|---|---|---|---|---|---|---|---|---|
| TSK-SWFC-f4c2-001 | Config | Crear workspace pnpm + Turborepo | Inicializar el monorepo con workspaces, scripts raíz y pipeline de build incremental. | US-SWFC-f4c2-001 | platform | package.json, pnpm-workspace.yaml, turbo.json | S | P1 | — | [x] |
| TSK-SWFC-f4c2-002 | Config | Configurar TypeScript estricto | Crear `tsconfig.base.json` con strict, paths compartidos y extenderlo en cada paquete. | US-SWFC-f4c2-001 | platform | tsconfig.base.json, apps/web/tsconfig.json, apps/api/tsconfig.json, apps/worker/tsconfig.json | S | P1 | TSK-SWFC-f4c2-001 | [x] |
| TSK-SWFC-f4c2-003 | Config | Configurar ESLint y Prettier | Agregar lint y formato consistentes con scripts raíz y reglas compartidas. | US-SWFC-f4c2-001 | platform | eslint.config.js, .prettierrc, .prettierignore | S | P1 | TSK-SWFC-f4c2-001 | [x] |
| TSK-SWFC-f4c2-004 | Test | Test de humo del workspace | Verificar que install, lint, typecheck y build corren desde la raíz sin errores. | US-SWFC-f4c2-001 | platform | tests/workspace-smoke.test.ts, package.json | S | P1 | TSK-SWFC-f4c2-002, TSK-SWFC-f4c2-003 | [x] |
| TSK-SWFC-f4c2-005 | DevOps | Crear workflow de CI | Pipeline de GitHub Actions con install, lint, typecheck y unit tests en cada PR. | US-SWFC-f4c2-002 | platform | .github/workflows/ci.yml | S | P1 | TSK-SWFC-f4c2-004 | [x] |
| TSK-SWFC-f4c2-006 | DevOps | Configurar checks requeridos | Documentar y aplicar branch protection con CI obligatorio en `main`. | US-SWFC-f4c2-002 | platform | docs/branch-protection.md, .github/workflows/ci.yml | S | P1 | TSK-SWFC-f4c2-005 | [x] |
| TSK-SWFC-f4c2-007 | Test | Validar el pipeline en un PR de prueba | Abrir un PR de prueba y confirmar que el pipeline bloquea fallos y pasa en verde. | US-SWFC-f4c2-002 | platform | tests/ci-smoke.md | S | P1 | TSK-SWFC-f4c2-005 | [x] |
| TSK-SWFC-f4c2-008 | DevOps | Crear Docker Compose base | Servicios web, api, worker, postgres y redis con redes y variables compartidas. | US-SWFC-f4c2-003 | platform | infra/docker-compose.yml | M | P1 | TSK-SWFC-f4c2-001 | [x] |
| TSK-SWFC-f4c2-009 | Config | Definir `.env.example` y validación | Documentar variables requeridas y validarlas al arranque con mensajes accionables. | US-SWFC-f4c2-003 | platform | .env.example, apps/api/src/config.ts | S | P1 | TSK-SWFC-f4c2-008 | [x] |
| TSK-SWFC-f4c2-010 | DevOps | Agregar healthchecks y volúmenes | Healthchecks de Postgres/Redis y volúmenes persistentes para datos. | US-SWFC-f4c2-003 | platform | infra/docker-compose.yml | S | P1 | TSK-SWFC-f4c2-008 | [x] |
| TSK-SWFC-f4c2-011 | Test | Smoke test de Compose | Script que levanta el stack, espera readiness y falla si un servicio no está sano. | US-SWFC-f4c2-003 | platform | scripts/smoke-compose.sh, tests/compose-smoke.test.ts | M | P1 | TSK-SWFC-f4c2-010 | [x] |
| TSK-SWFC-f4c2-012 | Backend | Esqueleto Fastify con healthchecks | API mínima con `/healthz`, `/readyz` y manejo de errores tipado. | US-SWFC-f4c2-004 | platform | apps/api/src/server.ts, apps/api/src/routes/health.ts | M | P1 | TSK-SWFC-f4c2-002 | [x] |
| TSK-SWFC-f4c2-013 | Frontend | Pantalla inicial Next.js | Home con estados vacío, loading y error de API, más layout base. | US-SWFC-f4c2-004 | web-ui | apps/web/app/page.tsx, apps/web/app/layout.tsx, apps/web/components/api-status.tsx | M | P1 | TSK-SWFC-f4c2-002 | [x] |
| TSK-SWFC-f4c2-014 | Backend | Validación de entorno con Zod | Validar todas las variables al arranque y fallar rápido si falta o es inválida. | US-SWFC-f4c2-004 | platform | apps/api/src/config.ts, apps/worker/src/config.ts | S | P1 | TSK-SWFC-f4c2-009 | [x] |
| TSK-SWFC-f4c2-015 | Test | Tests de healthchecks y config | Cubrir `/healthz`, `/readyz` con dependencias sanas y caídas, y validación de env. | US-SWFC-f4c2-004 | platform | tests/api/health.test.ts, tests/api/config.test.ts | S | P1 | TSK-SWFC-f4c2-012, TSK-SWFC-f4c2-014 | [x] |

## Evidencia de F0 (2026-11-08)

| Verificación | Comando | Resultado |
|---|---|---|
| Instalación | `pnpm install` | OK (pnpm 10.28.1) |
| Lint | `pnpm lint` | 5/5 paquetes OK |
| Typecheck | `pnpm typecheck` | 6/6 tareas OK |
| Tests | `pnpm test` | 12 tests OK (core 6, api 6) |
| Build | `pnpm build` | 5/5 tareas OK (Next.js 15.5.29) |
| Formato | `pnpm format:check` | OK |
| API runtime | `node apps/api/dist/server.js` + `curl /healthz /readyz` | 200 OK |
| Stack completo | `./scripts/smoke-compose.sh` | `compose stack is ready` |
| CI remoto | `gh pr checks 1 --watch` | `quality` pass (1m1s) |
| Branch protection | `gh api .../branches/main/protection` | required `quality`, strict, enforce_admins=true |

**F0 completo: 15/15 tareas verificadas.** Repo: https://github.com/gustavoghioldi/quinoto-software-factory

## Evidencia F1 (parcial, 2026-11-08)

| Verificación | Comando | Resultado |
|---|---|---|
| Tests | `pnpm test` | 49 tests OK (core 20, adapter 13, api 16) |
| Typecheck | `pnpm typecheck` | 10/10 tareas OK |
| Lint | `pnpm lint` | 7/7 tareas OK |
| Build | `pnpm build` | 7/7 tareas OK |
| Migraciones | `docker compose logs migrate` | `migrations applied` |
| Endpoints | `curl /projects`, `/github/manifest`, `/github/repos` | 200 / 200 / 409 correcto |
| UI | `curl /` y `/projects/new` | “Nuevo proyecto” / “Conectar GitHub” |

**Completadas:** `TSK-016` a `TSK-031` (**16/16**). F1 cerrado.
**Nota:** el manifest flow end-to-end requiere `FACTORY_BASE_URL` pública (túnel o dominio).

## Evidencia F2 (parcial, 2026-11-08)

| Verificación | Comando | Resultado |
|---|---|---|
| Tests | `pnpm test` | 67 tests OK (core 31, adapter 13, api 23) |
| Typecheck | `pnpm typecheck` | 10/10 tareas OK |
| Lint | `pnpm lint` | 7/7 tareas OK |
| Build | `pnpm build` | 7/7 tareas OK |
| Migración | `docker compose logs migrate` | `migrations applied` (0000 + 0001) |
| Endpoints | `curl /projects`, `/approvals` | 200 OK |
| UI | `curl /approvals` | “Aprobaciones y workflow” |

**Completadas:** `TSK-032` a `TSK-043` (**12/12**). F2 cerrado.

## Evidencia F3 (parcial, 2026-11-08)

| Verificación | Comando | Resultado |
|---|---|---|
| Tests | `pnpm test` | 81 tests OK (core 31, github 13, railway 4, api 33) |
| Typecheck | `pnpm typecheck` | 12/12 tareas OK |
| Lint | `pnpm lint` | 8/8 tareas OK |
| Build | `pnpm build` | 8/8 tareas OK |
| Migración | `docker compose logs migrate` | `migrations applied` (0000–0002) |
| UI | `curl /sessions/:id` | “Sesión de agente” |

**Completadas:** `TSK-044` a `TSK-054` (**11/11**). F3 cerrado.
**Nota:** sin `RAILWAY_API_TOKEN` se usa el mock; las sesiones persisten en Postgres.
