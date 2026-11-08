---
date: 2026-11-08
prefix: SWFC-f4c2
slug: f1-api-db
format: v2
type: change
---

## [2026-11-08] - F1 API and DB: GitHub Endpoints

### Resumen
- Se creó `packages/db` con Drizzle ORM: tablas `github_installations` y `projects`, migración `0000_wonderful_moonstone.sql`, repositorios Postgres y en memoria.
- Se implementaron las rutas `GET /github/manifest`, `GET /github/manifest/callback`, `GET /github/callback`, `GET /github/repos`, `GET|POST /projects` y `POST /webhooks/github`.
- El callback del manifest intercambia el código, cifra private key y webhook secret con AES-256-GCM y los persiste.
- El webhook valida la firma HMAC, rechaza con 401 y actualiza `installation_id` en eventos `installation`.
- Docker Compose agrega el servicio `migrate` y una master key de desarrollo; las migraciones se aplican antes de arrancar la API.
- Verificación: 49 tests OK (core 20, adapter 13, api 16), typecheck 10/10, lint 7/7, build 7/7, migraciones aplicadas y endpoints respondiendo.
- F1: 14/16 tareas completas. Pendientes: wizard y listado de proyectos en la UI (`TSK-025`, `TSK-026`).

**Tiempo Ahorrado**: ~14h (IA: 25m vs Humano: 14h)
