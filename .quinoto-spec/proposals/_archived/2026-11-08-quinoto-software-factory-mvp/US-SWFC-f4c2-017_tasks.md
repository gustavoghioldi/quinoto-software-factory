# Plan de Tareas (Quinoto Software Factory MVP — US-SWFC-f4c2-017)

**Proposal ID:** 2026-11-08-quinoto-software-factory-mvp
**Prefijo:** SWFC-f4c2
**Estado:** proposed

| ID | Tipo | Título | Descripción | Historia Relacionada | Servicio | Archivos a Modificar | Estimación | Prioridad | Dependencias | Estado |
|---|---|---|---|---|---|---|---|---|---|---|
| TSK-SWFC-f4c2-068 | Backend | Endpoint de overview | Agregar `GET /projects/overview` con etapa, sesiones activas, PRs y último deploy por proyecto. | US-SWFC-f4c2-017 | orchestrator | apps/api/src/routes/projects.ts, apps/api/src/services/overview-service.ts | M | P1 | TSK-SWFC-f4c2-065 | [x] |
| TSK-SWFC-f4c2-069 | Frontend | Dashboard multi-proyecto | Tarjetas con etapa del workflow, sesiones, PRs y deploy, con estados vacío/loading/error. | US-SWFC-f4c2-017 | web-ui | apps/web/components/project-list.tsx, apps/web/lib/api.ts, apps/web/lib/types.ts | L | P1 | TSK-SWFC-f4c2-068 | [x] |
| TSK-SWFC-f4c2-070 | Test | Tests de overview | Cubrir agregación de etapa, sesiones, PRs y deploy. | US-SWFC-f4c2-017 | orchestrator | apps/api/tests/overview.test.ts | S | P1 | TSK-SWFC-f4c2-068 | [x] |
