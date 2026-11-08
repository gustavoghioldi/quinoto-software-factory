---
date: 2026-11-08
prefix: SWFC-f4c2
slug: f3-complete
format: v2
type: change
---

## [2026-11-08] - F3 Complete: Session Persistence, SSE and Viewer

### Resumen
- Se agregó `infra/runner/Dockerfile` con OpenCode, git, Node 22, Python 3.12, usuario no root y healthcheck.
- Se agregaron las tablas `sessions` y `session_events` con migración `0002_sturdy_the_stranger.sql`.
- El `AgentRuntime` persiste sesiones y eventos en Postgres (o memoria sin DB) mediante `SessionStore`.
- Se implementó SSE en `GET /sessions/:id/events/stream` con soporte de `Last-Event-ID` y modo `?once=1` para tests.
- La UI suma `/sessions/[id]` con logs en vivo, estado y cancelación; el panel de workflow permite iniciar una sesión.
- Verificación: 81 tests OK (core 31, github 13, railway 4, api 33), typecheck 12/12, lint 8/8, build 8/8; migraciones 0000–0002 aplicadas; UI de sesión responde.
- **F3 cerrado: 11/11 tareas.**

**Tiempo Ahorrado**: ~10h (IA: 18m vs Humano: 10h)
