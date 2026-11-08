---
date: 2026-11-08
prefix: SWFC-f4c2
slug: f3-runtime-core
format: v2
type: change
---

## [2026-11-08] - F3 Core: Railway Adapter and Agent Runtime

### Resumen
- Se creó `packages/adapters-railway` con la interfaz `RailwayClient`, un cliente GraphQL, un `MockRailwayClient` y errores tipados.
- Se implementó `AgentRuntime`: sesiones, provisioning, cancelación, timeout, eventos y reconciliación de huérfanos.
- Endpoints nuevos: `POST /projects/:id/sessions`, `GET /sessions/:id`, `POST /sessions/:id/cancel` y `GET /sessions/:id/events`.
- Sin `RAILWAY_API_TOKEN`, la API usa el mock de Railway para desarrollo y tests.
- Verificación: 80 tests OK (core 31, github 13, railway 4, api 32), typecheck 12/12, lint 8/8, build 8/8.
- F3: 6/11 tareas completas. Pendientes: imagen `factory-runner`, DB de sesiones, SSE y visor de sesión.

**Tiempo Ahorrado**: ~14h (IA: 25m vs Humano: 14h)
