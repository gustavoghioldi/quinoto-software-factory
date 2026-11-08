# Plan de Tareas (Quinoto Software Factory MVP — US-SWFC-f4c2-005)

**Proposal ID:** 2026-11-08-quinoto-software-factory-mvp
**Prefijo:** SWFC-f4c2
**Estado:** proposed

| ID | Tipo | Título | Descripción | Historia Relacionada | Servicio | Archivos a Modificar | Estimación | Prioridad | Dependencias | Estado |
|---|---|---|---|---|---|---|---|---|---|---|
| TSK-SWFC-f4c2-016 | DB | Modelar instalaciones de GitHub | Crear tabla `github_installations` con app ID, installation ID, cuenta, private key y webhook secret cifrados. | US-SWFC-f4c2-005 | github-adapter | packages/db/src/schema.ts, packages/db/drizzle/0001_github_installations.sql | M | P1 | TSK-SWFC-f4c2-028 | [x] |
| TSK-SWFC-f4c2-017 | Backend | Construir manifest de GitHub App | Generar el manifest con permisos mínimos, eventos y callback configurable por entorno. | US-SWFC-f4c2-005 | github-adapter | packages/adapters-github/src/manifest.ts, packages/adapters-github/src/manifest.test.ts | S | P1 | — | [x] |
| TSK-SWFC-f4c2-018 | Backend | Implementar callback del manifest | Intercambiar el código del manifest por credenciales y persistirlas cifradas. | US-SWFC-f4c2-005 | github-adapter | apps/api/src/routes/github.ts, packages/adapters-github/src/app-auth.ts | L | P1 | TSK-SWFC-f4c2-016, TSK-SWFC-f4c2-017 | [x] |
| TSK-SWFC-f4c2-019 | Backend | Servicio de installation tokens | Firmar JWT RS256 y obtener/renovar installation tokens con caché y reintento único. | US-SWFC-f4c2-005 | github-adapter | packages/adapters-github/src/tokens.ts, packages/adapters-github/src/tokens.test.ts | M | P1 | TSK-SWFC-f4c2-018 | [x] |
| TSK-SWFC-f4c2-020 | Backend | Verificar webhooks de GitHub | Validar firma HMAC SHA-256 y rechazar payloads inválidos con 401 y auditoría. | US-SWFC-f4c2-005 | github-adapter | packages/adapters-github/src/webhooks.ts, apps/api/src/routes/webhooks.ts | S | P1 | TSK-SWFC-f4c2-016 | [x] |
| TSK-SWFC-f4c2-021 | Test | Tests del adaptador GitHub | Cubrir manifest, JWT/token, descubrimiento de repos y firma de webhooks con fetch inyectado. | US-SWFC-f4c2-005 | github-adapter | packages/adapters-github/src/*.test.ts | M | P1 | TSK-SWFC-f4c2-017, TSK-SWFC-f4c2-019, TSK-SWFC-f4c2-020 | [x] |
