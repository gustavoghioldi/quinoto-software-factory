---
date: 2026-11-08
prefix: SWFC-f4c2
slug: fix-cors-web-api
format: v2
type: fix
---

## [2026-11-08] - Fix: CORS between web and API

### Resumen
- Síntoma: la home mostraba “API no disponible (Failed to fetch)” aunque `curl` contra el API respondía 200.
- Causa raíz: el API no enviaba `Access-Control-Allow-Origin`, por lo que el navegador bloqueaba el fetch cross-origin desde `http://localhost:3000`.
- Fix: se agregó `@fastify/cors` con `CORS_ORIGINS` configurable; por defecto permite `http://localhost:3000` y `http://127.0.0.1:3000`.
- Se agregó test de regresión de CORS y otro de default de configuración.
- Evidencia: 12 tests OK (core 6, api 6); headers `access-control-allow-origin` presentes para ambos orígenes; contenedor `api` reconstruido y healthy.

**Tiempo Ahorrado**: ~1h (IA: 5m vs Humano: 1h)
