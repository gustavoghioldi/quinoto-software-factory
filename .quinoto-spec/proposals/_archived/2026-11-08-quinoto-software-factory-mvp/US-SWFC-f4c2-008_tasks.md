# Plan de Tareas (Quinoto Software Factory MVP — US-SWFC-f4c2-008)

**Proposal ID:** 2026-11-08-quinoto-software-factory-mvp
**Prefijo:** SWFC-f4c2
**Estado:** proposed

| ID | Tipo | Título | Descripción | Historia Relacionada | Servicio | Archivos a Modificar | Estimación | Prioridad | Dependencias | Estado |
|---|---|---|---|---|---|---|---|---|---|---|
| TSK-SWFC-f4c2-032 | Backend | Modelar la máquina de estados | Definir etapas, transiciones válidas y estados de un workflow run con errores tipados. | US-SWFC-f4c2-008 | orchestrator | packages/core/src/workflow.ts, packages/core/src/workflow.test.ts | M | P1 | — | [x] |
| TSK-SWFC-f4c2-033 | Backend | Implementar gates de etapa | Bloquear transiciones sin artefactos requeridos o sin aprobación humana registrada. | US-SWFC-f4c2-008 | orchestrator | packages/core/src/workflow.ts, packages/core/src/workflow.test.ts | M | P1 | TSK-SWFC-f4c2-032 | [x] |
| TSK-SWFC-f4c2-034 | Backend | Modelar artefactos y aprobaciones | Definir `ArtifactRecord` y `ApprovalRecord` con kind, checksum, subject, decisor y alcance. | US-SWFC-f4c2-008 | orchestrator | packages/core/src/artifacts.ts, packages/core/src/artifacts.test.ts | S | P1 | — | [x] |
| TSK-SWFC-f4c2-035 | DB | Persistir runs, etapas, artefactos y aprobaciones | Agregar tablas `workflow_runs`, `workflow_stages`, `artifacts` y `approvals` con migración. | US-SWFC-f4c2-008 | platform | packages/db/src/schema.ts, packages/db/drizzle/0001_workflow.sql | L | P1 | TSK-SWFC-f4c2-034 | [x] |
| TSK-SWFC-f4c2-036 | Backend | Endpoints de workflow | Exponer `POST /projects/:id/workflow/start` y `GET /projects/:id/workflow`. | US-SWFC-f4c2-008 | orchestrator | apps/api/src/routes/workflow.ts, apps/api/src/server.ts | M | P1 | TSK-SWFC-f4c2-033 | [x] |
| TSK-SWFC-f4c2-037 | Test | Tests de state machine y gates | Cubrir transiciones válidas/inválidas, artefactos faltantes y aprobaciones. | US-SWFC-f4c2-008 | orchestrator | packages/core/src/workflow.test.ts | M | P1 | TSK-SWFC-f4c2-033 | [x] |
