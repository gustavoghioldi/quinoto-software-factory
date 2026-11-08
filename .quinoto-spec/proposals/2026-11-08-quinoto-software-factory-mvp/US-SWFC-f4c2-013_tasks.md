# Plan de Tareas (Quinoto Software Factory MVP — US-SWFC-f4c2-013)

**Proposal ID:** 2026-11-08-quinoto-software-factory-mvp
**Prefijo:** SWFC-f4c2
**Estado:** proposed

| ID | Tipo | Título | Descripción | Historia Relacionada | Servicio | Archivos a Modificar | Estimación | Prioridad | Dependencias | Estado |
|---|---|---|---|---|---|---|---|---|---|---|
| TSK-SWFC-f4c2-053 | Backend | Reconciliar contenedores huérfanos | Job periódico que compara runners activos con sesiones y destruye los que no tienen sesión. | US-SWFC-f4c2-013 | agent-runtime | apps/api/src/services/agent-runtime.ts, apps/worker/src/index.ts | M | P1 | TSK-SWFC-f4c2-046 | [x] |
| TSK-SWFC-f4c2-054 | Test | Tests de reconciliación | Verificar detección, destrucción idempotente y auditoría de huérfanos. | US-SWFC-f4c2-013 | agent-runtime | apps/api/tests/sessions.test.ts | S | P1 | TSK-SWFC-f4c2-053 | [x] |
