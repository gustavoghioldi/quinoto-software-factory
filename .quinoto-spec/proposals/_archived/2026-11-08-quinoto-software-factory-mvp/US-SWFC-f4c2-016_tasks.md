# Plan de Tareas (Quinoto Software Factory MVP — US-SWFC-f4c2-016)

**Proposal ID:** 2026-11-08-quinoto-software-factory-mvp
**Prefijo:** SWFC-f4c2
**Estado:** proposed

| ID | Tipo | Título | Descripción | Historia Relacionada | Servicio | Archivos a Modificar | Estimación | Prioridad | Dependencias | Estado |
|---|---|---|---|---|---|---|---|---|---|---|
| TSK-SWFC-f4c2-063 | Backend | Deploy en Railway | Extender `RailwayClient` con `triggerDeploy`, `getDeployment` y logs; implementar mock y cliente GraphQL. | US-SWFC-f4c2-016 | railway-adapter | packages/adapters-railway/src/types.ts, packages/adapters-railway/src/client.ts, packages/adapters-railway/src/mock.ts | M | P1 | — | [x] |
| TSK-SWFC-f4c2-064 | DB | Persistir vínculo con Railway | Agregar tabla `railway_links` con proyecto/servicio/entorno y último deploy; migración 0003. | US-SWFC-f4c2-016 | platform | packages/db/src/schema.ts, packages/db/src/repositories.ts, packages/db/drizzle/0003_railway_links.sql | M | P1 | — | [x] |
| TSK-SWFC-f4c2-065 | Backend | Endpoints de vínculo y deploy | Exponer `POST/GET /projects/:id/railway` y `POST/GET /projects/:id/deploy`. | US-SWFC-f4c2-016 | railway-adapter | apps/api/src/routes/deployments.ts, apps/api/src/server.ts | M | P1 | TSK-SWFC-f4c2-063, TSK-SWFC-f4c2-064 | [x] |
| TSK-SWFC-f4c2-066 | Frontend | Panel de deploy | Formulario de vínculo y botón de deploy con estado y URL en el detalle del proyecto. | US-SWFC-f4c2-016 | web-ui | apps/web/app/projects/[id]/page.tsx, apps/web/components/deploy-panel.tsx | L | P1 | TSK-SWFC-f4c2-065 | [x] |
| TSK-SWFC-f4c2-067 | Test | Tests de deploy | Cubrir vínculo, trigger, estado y errores del adaptador. | US-SWFC-f4c2-016 | railway-adapter | packages/adapters-railway/src/client.test.ts, apps/api/tests/deployments.test.ts | M | P1 | TSK-SWFC-f4c2-063, TSK-SWFC-f4c2-065 | [x] |
