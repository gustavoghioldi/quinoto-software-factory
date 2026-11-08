# Fix: github-manifest-public-url

- **Fecha**: 2026-11-08 09:08
- **Descripción**: Al crear la GitHub App desde la instancia local, GitHub rechaza el manifest con “Hook url is not supported because it isn't reachable over the public Internet (localhost)” y “Default events unsupported: installation and installation_repositories”.
- **Comportamiento esperado**: `GET /github/manifest` debe rechazar una URL base no pública con un error claro (409) en lugar de generar un manifest inválido.
- **Comportamiento actual**: Genera el manifest con `http://localhost:4000` y eventos `installation`, `installation_repositories`; GitHub lo rechaza.
- **Stack detectado**: TypeScript, Fastify 5, Vitest 3, monorepo pnpm.
