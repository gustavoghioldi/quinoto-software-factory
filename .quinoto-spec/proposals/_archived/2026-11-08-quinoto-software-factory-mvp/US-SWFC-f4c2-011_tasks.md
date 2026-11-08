# Plan de Tareas (Quinoto Software Factory MVP — US-SWFC-f4c2-011)

**Proposal ID:** 2026-11-08-quinoto-software-factory-mvp
**Prefijo:** SWFC-f4c2
**Estado:** proposed

| ID | Tipo | Título | Descripción | Historia Relacionada | Servicio | Archivos a Modificar | Estimación | Prioridad | Dependencias | Estado |
|---|---|---|---|---|---|---|---|---|---|---|
| TSK-SWFC-f4c2-044 | Backend | Adaptador de Railway | Definir la interfaz `RailwayClient` (create/get/delete/list/logs) y un cliente GraphQL con errores tipados. | US-SWFC-f4c2-011 | railway-adapter | packages/adapters-railway/src/types.ts, packages/adapters-railway/src/client.ts | L | P1 | — | [x] |
| TSK-SWFC-f4c2-045 | DevOps | Imagen factory-runner | Crear Dockerfile con OpenCode, git, Node 22 y Python 3.12; healthcheck y usuario no root. | US-SWFC-f4c2-011 | platform | infra/runner/Dockerfile, infra/runner/healthcheck.sh | M | P1 | — | [x] |
| TSK-SWFC-f4c2-046 | Backend | Servicio de runtime de agentes | Implementar sesiones, provisioning, cancelación, timeout y almacenamiento de eventos. | US-SWFC-f4c2-011 | agent-runtime | apps/api/src/services/agent-runtime.ts | L | P1 | TSK-SWFC-f4c2-044 | [x] |
| TSK-SWFC-f4c2-047 | DB | Persistir sesiones y eventos | Agregar tablas `sessions` y `session_events` con migración. | US-SWFC-f4c2-011 | platform | packages/db/src/schema.ts, packages/db/drizzle/0002_sessions.sql | M | P1 | — | [x] |
| TSK-SWFC-f4c2-048 | Backend | Endpoints de sesiones | Exponer `POST /projects/:id/sessions`, `GET /sessions/:id` y `POST /sessions/:id/cancel`. | US-SWFC-f4c2-011 | agent-runtime | apps/api/src/routes/sessions.ts, apps/api/src/server.ts | M | P1 | TSK-SWFC-f4c2-046 | [x] |
| TSK-SWFC-f4c2-049 | Test | Tests de Railway y runtime | Cubrir provisioning, cancelación, timeout y errores del adaptador con fetch/mocks. | US-SWFC-f4c2-011 | agent-runtime | packages/adapters-railway/src/*.test.ts, apps/api/tests/sessions.test.ts | M | P1 | TSK-SWFC-f4c2-044, TSK-SWFC-f4c2-046 | [x] |
