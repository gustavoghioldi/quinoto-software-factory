# Plan de Tareas (Quinoto Software Factory MVP — US-SWFC-f4c2-006)

**Proposal ID:** 2026-11-08-quinoto-software-factory-mvp
**Prefijo:** SWFC-f4c2
**Estado:** proposed

| ID | Tipo | Título | Descripción | Historia Relacionada | Servicio | Archivos a Modificar | Estimación | Prioridad | Dependencias | Estado |
|---|---|---|---|---|---|---|---|---|---|---|
| TSK-SWFC-f4c2-022 | Backend | Endpoint de descubrimiento de repos | Exponer `GET /github/repos` con los repos de la instalación, branch por defecto y permisos. | US-SWFC-f4c2-006 | github-adapter | apps/api/src/routes/github.ts, packages/adapters-github/src/repos.ts, packages/adapters-github/src/repos.test.ts | M | P1 | TSK-SWFC-f4c2-019 | [x] |
| TSK-SWFC-f4c2-023 | Backend | Endpoint de creación de proyecto | Exponer `POST /projects` con repo, branch base y validación de permisos; estado inicial `ready`. | US-SWFC-f4c2-006 | orchestrator | apps/api/src/routes/projects.ts, packages/core/src/projects.ts | M | P1 | TSK-SWFC-f4c2-024 | [x] |
| TSK-SWFC-f4c2-024 | DB | Modelar proyectos | Crear tabla `projects` con repo, branch, instalación, estado y timestamps. | US-SWFC-f4c2-006 | platform | packages/db/src/schema.ts, packages/db/drizzle/0002_projects.sql | M | P1 | TSK-SWFC-f4c2-016 | [x] |
| TSK-SWFC-f4c2-025 | Frontend | Wizard de conexión GitHub | Flujo de instalación, selección de repo y branch con estados vacío/loading/error. | US-SWFC-f4c2-006 | web-ui | apps/web/app/projects/new/page.tsx, apps/web/components/github-connect.tsx | L | P1 | TSK-SWFC-f4c2-022 | [ ] |
| TSK-SWFC-f4c2-026 | Frontend | Listado de proyectos | Dashboard inicial con proyectos, repo, branch y estado. | US-SWFC-f4c2-006 | web-ui | apps/web/app/page.tsx, apps/web/components/project-list.tsx | M | P1 | TSK-SWFC-f4c2-023 | [ ] |
| TSK-SWFC-f4c2-027 | Test | Tests de API de proyectos | Cubrir repos y projects con fetch mockeado y base de datos de test. | US-SWFC-f4c2-006 | orchestrator | apps/api/tests/github.test.ts, apps/api/tests/projects.test.ts | M | P1 | TSK-SWFC-f4c2-022, TSK-SWFC-f4c2-023 | [x] |
