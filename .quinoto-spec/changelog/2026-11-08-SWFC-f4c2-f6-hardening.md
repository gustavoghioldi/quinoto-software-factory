---
date: 2026-11-08
prefix: SWFC-f4c2
slug: f6-hardening
format: v2
type: change
---

## [2026-11-08] - F6 Complete: Audit, Redaction and Self-Host Operations

### Resumen
- Se agregó la tabla `audit_entries` con migración `0004_adorable_red_skull.sql` y repositorios en memoria/Postgres.
- El `AuditService` registra aprobaciones, PRs, vínculos/deploys de Railway y cancelaciones de sesión.
- Se implementaron `redactSecrets`/`redactValue` y se aplican a eventos de sesión y detalles de auditoría.
- Endpoint de solo lectura `GET /audit?projectId=`.
- Documentación de operación self-hosted: `docs/operations.md` (instalación, upgrade, backup/restore, troubleshooting).
- Checklist de release en `docs/release-checklist.md` y auditoría de licencias en `scripts/license-audit.sh`.
- Verificación: 102 tests OK (core 35, github 17, railway 7, api 43), typecheck 12/12, lint 8/8, build 8/8, license audit passed, migraciones 0000–0004 aplicadas.
- **F6 cerrado: 8/8 tareas. MVP v1 completo (F0–F6).**

**Tiempo Ahorrado**: ~8h (IA: 15m vs Humano: 8h)
