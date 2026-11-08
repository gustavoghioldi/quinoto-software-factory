# Plan de Tareas (Quinoto Software Factory MVP — Fase F0)

**Proposal ID:** 2026-11-08-quinoto-software-factory-mvp
**Prefijo:** SWFC-f4c2
**Estado:** proposed

> Índice consolidado de la fase F0. Las tareas de F1+ se generan al cerrar esta fase.

| ID | Tipo | Título | Descripción | Historia Relacionada | Servicio | Archivos a Modificar | Estimación | Prioridad | Dependencias | Estado |
|---|---|---|---|---|---|---|---|---|---|---|
| TSK-SWFC-f4c2-001 | Config | Crear workspace pnpm + Turborepo | Inicializar el monorepo con workspaces, scripts raíz y pipeline de build incremental. | US-SWFC-f4c2-001 | platform | package.json, pnpm-workspace.yaml, turbo.json | S | P1 | — | [ ] |
| TSK-SWFC-f4c2-002 | Config | Configurar TypeScript estricto | Crear `tsconfig.base.json` con strict, paths compartidos y extenderlo en cada paquete. | US-SWFC-f4c2-001 | platform | tsconfig.base.json, apps/web/tsconfig.json, apps/api/tsconfig.json, apps/worker/tsconfig.json | S | P1 | TSK-SWFC-f4c2-001 | [ ] |
| TSK-SWFC-f4c2-003 | Config | Configurar ESLint y Prettier | Agregar lint y formato consistentes con scripts raíz y reglas compartidas. | US-SWFC-f4c2-001 | platform | eslint.config.js, .prettierrc, .prettierignore | S | P1 | TSK-SWFC-f4c2-001 | [ ] |
| TSK-SWFC-f4c2-004 | Test | Test de humo del workspace | Verificar que install, lint, typecheck y build corren desde la raíz sin errores. | US-SWFC-f4c2-001 | platform | tests/workspace-smoke.test.ts, package.json | S | P1 | TSK-SWFC-f4c2-002, TSK-SWFC-f4c2-003 | [ ] |
| TSK-SWFC-f4c2-005 | DevOps | Crear workflow de CI | Pipeline de GitHub Actions con install, lint, typecheck y unit tests en cada PR. | US-SWFC-f4c2-002 | platform | .github/workflows/ci.yml | S | P1 | TSK-SWFC-f4c2-004 | [ ] |
| TSK-SWFC-f4c2-006 | DevOps | Configurar checks requeridos | Documentar y aplicar branch protection con CI obligatorio en `main`. | US-SWFC-f4c2-002 | platform | docs/branch-protection.md, .github/workflows/ci.yml | S | P1 | TSK-SWFC-f4c2-005 | [ ] |
| TSK-SWFC-f4c2-007 | Test | Validar el pipeline en un PR de prueba | Abrir un PR de prueba y confirmar que el pipeline bloquea fallos y pasa en verde. | US-SWFC-f4c2-002 | platform | tests/ci-smoke.md | S | P1 | TSK-SWFC-f4c2-005 | [ ] |
| TSK-SWFC-f4c2-008 | DevOps | Crear Docker Compose base | Servicios web, api, worker, postgres y redis con redes y variables compartidas. | US-SWFC-f4c2-003 | platform | infra/docker-compose.yml | M | P1 | TSK-SWFC-f4c2-001 | [ ] |
| TSK-SWFC-f4c2-009 | Config | Definir `.env.example` y validación | Documentar variables requeridas y validarlas al arranque con mensajes accionables. | US-SWFC-f4c2-003 | platform | .env.example, apps/api/src/config.ts | S | P1 | TSK-SWFC-f4c2-008 | [ ] |
| TSK-SWFC-f4c2-010 | DevOps | Agregar healthchecks y volúmenes | Healthchecks de Postgres/Redis y volúmenes persistentes para datos. | US-SWFC-f4c2-003 | platform | infra/docker-compose.yml | S | P1 | TSK-SWFC-f4c2-008 | [ ] |
| TSK-SWFC-f4c2-011 | Test | Smoke test de Compose | Script que levanta el stack, espera readiness y falla si un servicio no está sano. | US-SWFC-f4c2-003 | platform | scripts/smoke-compose.sh, tests/compose-smoke.test.ts | M | P1 | TSK-SWFC-f4c2-010 | [ ] |
| TSK-SWFC-f4c2-012 | Backend | Esqueleto Fastify con healthchecks | API mínima con `/healthz`, `/readyz` y manejo de errores tipado. | US-SWFC-f4c2-004 | platform | apps/api/src/server.ts, apps/api/src/routes/health.ts | M | P1 | TSK-SWFC-f4c2-002 | [ ] |
| TSK-SWFC-f4c2-013 | Frontend | Pantalla inicial Next.js | Home con estados vacío, loading y error de API, más layout base. | US-SWFC-f4c2-004 | web-ui | apps/web/app/page.tsx, apps/web/app/layout.tsx, apps/web/components/api-status.tsx | M | P1 | TSK-SWFC-f4c2-002 | [ ] |
| TSK-SWFC-f4c2-014 | Backend | Validación de entorno con Zod | Validar todas las variables al arranque y fallar rápido si falta o es inválida. | US-SWFC-f4c2-004 | platform | apps/api/src/config.ts, apps/worker/src/config.ts | S | P1 | TSK-SWFC-f4c2-009 | [ ] |
| TSK-SWFC-f4c2-015 | Test | Tests de healthchecks y config | Cubrir `/healthz`, `/readyz` con dependencias sanas y caídas, y validación de env. | US-SWFC-f4c2-004 | platform | tests/api/health.test.ts, tests/api/config.test.ts | S | P1 | TSK-SWFC-f4c2-012, TSK-SWFC-f4c2-014 | [ ] |
