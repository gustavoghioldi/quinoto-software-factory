---
date: 2026-11-08
prefix: SWFC-f4c2
slug: f1-foundation
format: v2
type: change
---

## [2026-11-08] - F1 Foundation: Crypto and GitHub Adapter

### Resumen
- Se implementó `packages/core/src/crypto.ts`: AES-256-GCM con envelope versionado, nonce aleatorio, detección de tampering y validación de master key.
- Se agregó `EncryptedMemorySecretStore` y validación de `FACTORY_MASTER_KEY` en la configuración.
- Se creó `packages/adapters-github` con manifest de GitHub App, JWT RS256, installation tokens con caché, descubrimiento de repos y verificación de webhooks.
- Tests: 37 OK (core 20, adapters-github 11, api 6). Typecheck 7/7, lint 6/6, build 6/6.
- Tareas F1 completadas: `TSK-017`, `TSK-019`, `TSK-021`, `TSK-028`, `TSK-029`, `TSK-030`, `TSK-031`.
- Pendientes de F1: DB de instalaciones/proyectos, callback del manifest, endpoint de webhooks, endpoints de repos/projects y UI.

**Tiempo Ahorrado**: ~12h (IA: 20m vs Humano: 12h)
