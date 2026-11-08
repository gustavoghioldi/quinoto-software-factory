# Plan de Tareas (Quinoto Software Factory MVP — US-SWFC-f4c2-010)

**Proposal ID:** 2026-11-08-quinoto-software-factory-mvp
**Prefijo:** SWFC-f4c2
**Estado:** proposed

| ID | Tipo | Título | Descripción | Historia Relacionada | Servicio | Archivos a Modificar | Estimación | Prioridad | Dependencias | Estado |
|---|---|---|---|---|---|---|---|---|---|---|
| TSK-SWFC-f4c2-041 | Backend | Retry desde checkpoint | Reanudar la última etapa fallida sin tocar artefactos de etapas completadas e incrementar intentos. | US-SWFC-f4c2-010 | orchestrator | packages/core/src/workflow.ts, packages/core/src/workflow.test.ts | M | P1 | TSK-SWFC-f4c2-033 | [x] |
| TSK-SWFC-f4c2-042 | Backend | Endpoint de retry | Exponer `POST /projects/:id/workflow/retry` con errores tipados si no hay etapa fallida. | US-SWFC-f4c2-010 | orchestrator | apps/api/src/routes/workflow.ts | S | P1 | TSK-SWFC-f4c2-041 | [x] |
| TSK-SWFC-f4c2-043 | Test | Tests de retry | Verificar reanudación en la etapa correcta, preservación de artefactos y timeline de intentos. | US-SWFC-f4c2-010 | orchestrator | packages/core/src/workflow.test.ts | S | P1 | TSK-SWFC-f4c2-041 | [x] |
