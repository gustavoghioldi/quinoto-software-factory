# Plan de Tareas (Quinoto Software Factory MVP — US-SWFC-f4c2-001)

**Proposal ID:** 2026-11-08-quinoto-software-factory-mvp
**Prefijo:** SWFC-f4c2
**Estado:** proposed

| ID | Tipo | Título | Descripción | Historia Relacionada | Servicio | Archivos a Modificar | Estimación | Prioridad | Dependencias | Estado |
|---|---|---|---|---|---|---|---|---|---|---|
| TSK-SWFC-f4c2-001 | Config | Crear workspace pnpm + Turborepo | Inicializar el monorepo con workspaces, scripts raíz y pipeline de build incremental. | US-SWFC-f4c2-001 | platform | package.json, pnpm-workspace.yaml, turbo.json | S | P1 | — | [ ] |
| TSK-SWFC-f4c2-002 | Config | Configurar TypeScript estricto | Crear `tsconfig.base.json` con strict, paths compartidos y extenderlo en cada paquete. | US-SWFC-f4c2-001 | platform | tsconfig.base.json, apps/web/tsconfig.json, apps/api/tsconfig.json, apps/worker/tsconfig.json | S | P1 | TSK-SWFC-f4c2-001 | [ ] |
| TSK-SWFC-f4c2-003 | Config | Configurar ESLint y Prettier | Agregar lint y formato consistentes con scripts raíz y reglas compartidas. | US-SWFC-f4c2-001 | platform | eslint.config.js, .prettierrc, .prettierignore | S | P1 | TSK-SWFC-f4c2-001 | [ ] |
| TSK-SWFC-f4c2-004 | Test | Test de humo del workspace | Verificar que install, lint, typecheck y build corren desde la raíz sin errores. | US-SWFC-f4c2-001 | platform | tests/workspace-smoke.test.ts, package.json | S | P1 | TSK-SWFC-f4c2-002, TSK-SWFC-f4c2-003 | [ ] |
