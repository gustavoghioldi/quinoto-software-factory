# Plan de Tareas (Quinoto Software Factory MVP — US-SWFC-f4c2-014)

**Proposal ID:** 2026-11-08-quinoto-software-factory-mvp
**Prefijo:** SWFC-f4c2
**Estado:** proposed

| ID | Tipo | Título | Descripción | Historia Relacionada | Servicio | Archivos a Modificar | Estimación | Prioridad | Dependencias | Estado |
|---|---|---|---|---|---|---|---|---|---|---|
| TSK-SWFC-f4c2-055 | Backend | Abrir Pull Request en GitHub | Implementar `openPullRequest` con búsqueda de PR existente e idempotencia ante 422. | US-SWFC-f4c2-014 | github-adapter | packages/adapters-github/src/delivery.ts, packages/adapters-github/src/delivery.test.ts | M | P1 | — | [x] |
| TSK-SWFC-f4c2-056 | Backend | Capturar el diff de la sesión | Leer el último evento `diff` de la sesión y exponerlo como payload estructurado. | US-SWFC-f4c2-014 | agent-runtime | apps/api/src/routes/delivery.ts | S | P1 | — | [x] |
| TSK-SWFC-f4c2-057 | Backend | Endpoints de diff y PR | Exponer `GET /sessions/:id/diff` y `POST /sessions/:id/pull-request`. | US-SWFC-f4c2-014 | agent-runtime | apps/api/src/routes/delivery.ts, apps/api/src/server.ts | M | P1 | TSK-SWFC-f4c2-055 | [x] |
| TSK-SWFC-f4c2-058 | Frontend | Visor de diff y confirmación de PR | Mostrar archivos del diff y un formulario para abrir el PR con título y branch base. | US-SWFC-f4c2-014 | web-ui | apps/web/components/session-viewer.tsx, apps/web/lib/api.ts | L | P1 | TSK-SWFC-f4c2-057 | [x] |
| TSK-SWFC-f4c2-059 | Test | Tests de delivery | Cubrir apertura de PR, idempotencia, diff y errores tipados. | US-SWFC-f4c2-014 | github-adapter | packages/adapters-github/src/delivery.test.ts, apps/api/tests/delivery.test.ts | M | P1 | TSK-SWFC-f4c2-055, TSK-SWFC-f4c2-057 | [x] |
