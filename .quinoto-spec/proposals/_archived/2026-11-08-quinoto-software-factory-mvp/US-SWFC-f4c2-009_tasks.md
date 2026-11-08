# Plan de Tareas (Quinoto Software Factory MVP — US-SWFC-f4c2-009)

**Proposal ID:** 2026-11-08-quinoto-software-factory-mvp
**Prefijo:** SWFC-f4c2
**Estado:** proposed

| ID | Tipo | Título | Descripción | Historia Relacionada | Servicio | Archivos a Modificar | Estimación | Prioridad | Dependencias | Estado |
|---|---|---|---|---|---|---|---|---|---|---|
| TSK-SWFC-f4c2-038 | Backend | Endpoints de aprobaciones | Exponer `GET /approvals` y `POST /approvals/:id/decision` con validación de decisor y alcance. | US-SWFC-f4c2-009 | orchestrator | apps/api/src/routes/approvals.ts, packages/core/src/artifacts.ts | M | P1 | TSK-SWFC-f4c2-035 | [x] |
| TSK-SWFC-f4c2-039 | Frontend | Bandeja de aprobaciones | Vista con aprobaciones pendientes, detalle del artefacto y acciones aprobar/rechazar. | US-SWFC-f4c2-009 | web-ui | apps/web/app/approvals/page.tsx, apps/web/components/approval-inbox.tsx | M | P1 | TSK-SWFC-f4c2-038 | [x] |
| TSK-SWFC-f4c2-040 | Test | Tests de aprobaciones | Cubrir aprobación, rechazo, usuario no autorizado y bloqueo de la etapa siguiente. | US-SWFC-f4c2-009 | orchestrator | apps/api/tests/approvals.test.ts, packages/core/src/artifacts.test.ts | M | P1 | TSK-SWFC-f4c2-038 | [x] |
