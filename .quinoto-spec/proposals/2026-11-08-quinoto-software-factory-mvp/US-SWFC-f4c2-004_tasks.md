# Plan de Tareas (Quinoto Software Factory MVP — US-SWFC-f4c2-004)

**Proposal ID:** 2026-11-08-quinoto-software-factory-mvp
**Prefijo:** SWFC-f4c2
**Estado:** proposed

| ID | Tipo | Título | Descripción | Historia Relacionada | Servicio | Archivos a Modificar | Estimación | Prioridad | Dependencias | Estado |
|---|---|---|---|---|---|---|---|---|---|---|
| TSK-SWFC-f4c2-012 | Backend | Esqueleto Fastify con healthchecks | API mínima con `/healthz`, `/readyz` y manejo de errores tipado. | US-SWFC-f4c2-004 | platform | apps/api/src/server.ts, apps/api/src/routes/health.ts | M | P1 | TSK-SWFC-f4c2-002 | [x] |
| TSK-SWFC-f4c2-013 | Frontend | Pantalla inicial Next.js | Home con estados vacío, loading y error de API, más layout base. | US-SWFC-f4c2-004 | web-ui | apps/web/app/page.tsx, apps/web/app/layout.tsx, apps/web/components/api-status.tsx | M | P1 | TSK-SWFC-f4c2-002 | [x] |
| TSK-SWFC-f4c2-014 | Backend | Validación de entorno con Zod | Validar todas las variables al arranque y fallar rápido si falta o es inválida. | US-SWFC-f4c2-004 | platform | apps/api/src/config.ts, apps/worker/src/config.ts | S | P1 | TSK-SWFC-f4c2-009 | [x] |
| TSK-SWFC-f4c2-015 | Test | Tests de healthchecks y config | Cubrir `/healthz`, `/readyz` con dependencias sanas y caídas, y validación de env. | US-SWFC-f4c2-004 | platform | tests/api/health.test.ts, tests/api/config.test.ts | S | P1 | TSK-SWFC-f4c2-012, TSK-SWFC-f4c2-014 | [x] |
