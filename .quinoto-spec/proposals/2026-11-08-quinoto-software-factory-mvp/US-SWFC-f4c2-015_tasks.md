# Plan de Tareas (Quinoto Software Factory MVP — US-SWFC-f4c2-015)

**Proposal ID:** 2026-11-08-quinoto-software-factory-mvp
**Prefijo:** SWFC-f4c2
**Estado:** proposed

| ID | Tipo | Título | Descripción | Historia Relacionada | Servicio | Archivos a Modificar | Estimación | Prioridad | Dependencias | Estado |
|---|---|---|---|---|---|---|---|---|---|---|
| TSK-SWFC-f4c2-060 | Backend | Proteger la rama principal | Rechazar head `main`/`master` y cualquier head igual al base con `ProtectedBranchError`. | US-SWFC-f4c2-015 | github-adapter | packages/adapters-github/src/delivery.ts | S | P1 | TSK-SWFC-f4c2-055 | [x] |
| TSK-SWFC-f4c2-061 | Test | Tests de rama protegida e idempotencia | Verificar rechazo de main, reutilización de PR existente y errores tipados. | US-SWFC-f4c2-015 | github-adapter | packages/adapters-github/src/delivery.test.ts | S | P1 | TSK-SWFC-f4c2-060 | [x] |
| TSK-SWFC-f4c2-062 | Backend | Auditar la entrega | Registrar un evento `pull_request` en la sesión con número y URL del PR. | US-SWFC-f4c2-015 | agent-runtime | apps/api/src/routes/delivery.ts | S | P1 | TSK-SWFC-f4c2-057 | [x] |
