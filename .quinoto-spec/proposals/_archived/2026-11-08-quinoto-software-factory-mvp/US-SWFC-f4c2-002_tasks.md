# Plan de Tareas (Quinoto Software Factory MVP — US-SWFC-f4c2-002)

**Proposal ID:** 2026-11-08-quinoto-software-factory-mvp
**Prefijo:** SWFC-f4c2
**Estado:** proposed

| ID | Tipo | Título | Descripción | Historia Relacionada | Servicio | Archivos a Modificar | Estimación | Prioridad | Dependencias | Estado |
|---|---|---|---|---|---|---|---|---|---|---|
| TSK-SWFC-f4c2-005 | DevOps | Crear workflow de CI | Pipeline de GitHub Actions con install, lint, typecheck y unit tests en cada PR. | US-SWFC-f4c2-002 | platform | .github/workflows/ci.yml | S | P1 | TSK-SWFC-f4c2-004 | [x] |
| TSK-SWFC-f4c2-006 | DevOps | Configurar checks requeridos | Documentar y aplicar branch protection con CI obligatorio en `main`. | US-SWFC-f4c2-002 | platform | docs/branch-protection.md, .github/workflows/ci.yml | S | P1 | TSK-SWFC-f4c2-005 | [x] |
| TSK-SWFC-f4c2-007 | Test | Validar el pipeline en un PR de prueba | Abrir un PR de prueba y confirmar que el pipeline bloquea fallos y pasa en verde. | US-SWFC-f4c2-002 | platform | tests/ci-smoke.md | S | P1 | TSK-SWFC-f4c2-005 | [x] |
