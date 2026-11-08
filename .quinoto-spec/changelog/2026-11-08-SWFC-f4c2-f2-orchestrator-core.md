---
date: 2026-11-08
prefix: SWFC-f4c2
slug: f2-orchestrator-core
format: v2
type: change
---

## [2026-11-08] - F2 Core: Workflow State Machine and Gates

### Resumen
- Se implementó `packages/core/src/workflow.ts`: etapas, transiciones válidas, gates por artefactos y aprobaciones, fallo de etapa y retry desde checkpoint.
- Se agregó `packages/core/src/artifacts.ts` con `ArtifactRecord`, `ApprovalRecord`, `hasArtifact` y `hasApproval`.
- Se agregó el esquema de persistencia: `workflow_runs`, `workflow_stages`, `artifacts` y `approvals`, con migración `0001_orange_union_jack.sql`.
- Tests: 60 OK (core 31, adapter 13, api 16). Typecheck 10/10, lint 7/7, build 7/7.
- F2: 7/12 tareas completas. Pendientes: endpoints de workflow/retry y aprobaciones (API + UI).

**Tiempo Ahorrado**: ~10h (IA: 15m vs Humano: 10h)
