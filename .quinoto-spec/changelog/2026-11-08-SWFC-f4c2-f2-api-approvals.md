---
date: 2026-11-08
prefix: SWFC-f4c2
slug: f2-api-approvals
format: v2
type: change
---

## [2026-11-08] - F2 Complete: Workflow API and Approvals UI

### Resumen
- Se implementó `WorkflowService` con repositorios en memoria y Postgres para runs, etapas, artefactos y aprobaciones.
- Endpoints nuevos: `POST /projects/:id/workflow/start`, `GET /projects/:id/workflow`, `POST /projects/:id/workflow/advance`, `POST /projects/:id/workflow/retry`, `GET /approvals` y `POST /approvals`.
- La UI suma `/approvals` con panel de workflow, etapa actual, historial y acción “Aprobar propuesta”.
- Verificación: 67 tests OK (core 31, adapter 13, api 23), typecheck 10/10, lint 7/7, build 7/7; migraciones 0000+0001 aplicadas; `/projects`, `/approvals` y la página `/approvals` responden.
- **F2 cerrado: 12/12 tareas.**

**Tiempo Ahorrado**: ~12h (IA: 20m vs Humano: 12h)
