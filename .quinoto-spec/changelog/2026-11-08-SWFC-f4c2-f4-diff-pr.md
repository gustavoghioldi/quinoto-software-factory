---
date: 2026-11-08
prefix: SWFC-f4c2
slug: f4-diff-pr
format: v2
type: change
---

## [2026-11-08] - F4 Complete: Diff Review and Pull Request

### Resumen
- Se implementó `openPullRequest` en `packages/adapters-github` con idempotencia ante 422 y `ProtectedBranchError` para head `main`/`master`.
- Nuevos endpoints: `GET /sessions/:id/diff` y `POST /sessions/:id/pull-request`.
- El endpoint de PR registra un evento `pull_request` en la sesión como auditoría.
- La UI del visor de sesión muestra el diff por archivo y un formulario para abrir el PR con título y branch base.
- Verificación: 89 tests OK (core 31, github 17, railway 4, api 37), typecheck 12/12, lint 8/8, build 8/8; UI con “Diff” y “Pull Request”.
- **F4 cerrado: 8/8 tareas.**

**Tiempo Ahorrado**: ~8h (IA: 15m vs Humano: 8h)
