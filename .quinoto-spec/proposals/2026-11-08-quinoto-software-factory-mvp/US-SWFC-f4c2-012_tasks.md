# Plan de Tareas (Quinoto Software Factory MVP — US-SWFC-f4c2-012)

**Proposal ID:** 2026-11-08-quinoto-software-factory-mvp
**Prefijo:** SWFC-f4c2
**Estado:** proposed

| ID | Tipo | Título | Descripción | Historia Relacionada | Servicio | Archivos a Modificar | Estimación | Prioridad | Dependencias | Estado |
|---|---|---|---|---|---|---|---|---|---|---|
| TSK-SWFC-f4c2-050 | Backend | Stream SSE de eventos | Exponer `GET /sessions/:id/events` como SSE con `Last-Event-ID` y redacción de secretos. | US-SWFC-f4c2-012 | agent-runtime | apps/api/src/routes/sessions.ts, apps/api/src/services/agent-runtime.ts | M | P1 | TSK-SWFC-f4c2-048 | [ ] |
| TSK-SWFC-f4c2-051 | Frontend | Visor de sesión en vivo | Página con estado, logs en streaming y botón cancelar. | US-SWFC-f4c2-012 | web-ui | apps/web/app/sessions/[id]/page.tsx, apps/web/components/session-viewer.tsx | L | P1 | TSK-SWFC-f4c2-050 | [ ] |
| TSK-SWFC-f4c2-052 | Test | Tests de eventos y SSE | Cubrir orden de eventos, reconexión con Last-Event-ID y redacción. | US-SWFC-f4c2-012 | agent-runtime | apps/api/tests/sessions.test.ts | M | P1 | TSK-SWFC-f4c2-050 | [ ] |
