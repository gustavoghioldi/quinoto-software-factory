# Plan de Tareas (Quinoto Software Factory MVP — US-SWFC-f4c2-018)

**Proposal ID:** 2026-11-08-quinoto-software-factory-mvp
**Prefijo:** SWFC-f4c2
**Estado:** proposed

| ID | Tipo | Título | Descripción | Historia Relacionada | Servicio | Archivos a Modificar | Estimación | Prioridad | Dependencias | Estado |
|---|---|---|---|---|---|---|---|---|---|---|
| TSK-SWFC-f4c2-071 | DB | Persistir auditoría append-only | Agregar tabla `audit_entries` con actor, acción, subject y detalle; migración 0004. | US-SWFC-f4c2-018 | security | packages/db/src/schema.ts, packages/db/src/repositories.ts, packages/db/drizzle/0004_audit.sql | M | P1 | — | [x] |
| TSK-SWFC-f4c2-072 | Backend | Servicio de auditoría | Registrar aprobaciones, PRs, deploys y cancelaciones en la auditoría. | US-SWFC-f4c2-018 | security | apps/api/src/services/audit-service.ts, apps/api/src/routes/*.ts | M | P1 | TSK-SWFC-f4c2-071 | [x] |
| TSK-SWFC-f4c2-073 | Backend | Redacción de secretos | Implementar `redactSecrets`/`redactValue` y aplicarlo a eventos de sesión y auditoría. | US-SWFC-f4c2-018 | security | packages/core/src/redaction.ts, packages/core/src/redaction.test.ts | M | P1 | — | [x] |
| TSK-SWFC-f4c2-074 | Backend | Endpoint de auditoría | Exponer `GET /audit?projectId=` de solo lectura. | US-SWFC-f4c2-018 | security | apps/api/src/routes/audit.ts, apps/api/src/server.ts | S | P1 | TSK-SWFC-f4c2-072 | [x] |
| TSK-SWFC-f4c2-075 | Test | Tests de auditoría y redacción | Cubrir redacción de tokens, registro de acciones y lectura de auditoría. | US-SWFC-f4c2-018 | security | apps/api/tests/audit.test.ts, packages/core/src/redaction.test.ts | M | P1 | TSK-SWFC-f4c2-072, TSK-SWFC-f4c2-073 | [x] |
