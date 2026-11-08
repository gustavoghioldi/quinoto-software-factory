---
date: 2026-11-08
prefix: ZZZZ
slug: fix-github-manifest-public-url
format: v2
type: fix
---

## [2026-11-08] - Fix: GitHub App manifest requires a public URL

### Resumen
- `apps/api/src/routes/github.ts` — [modificado] — `GET /github/manifest` devuelve `409 public_url_required` si `FACTORY_BASE_URL` es localhost/loopback.
- `apps/api/tests/github.test.ts` — [modificado] — test de regresión para el guard.
- `.quinoto-spec/fixes/20261108-0908-github-manifest-public-url.md` — [nuevo] — contexto del fix.
- **Causa raíz:** el manifest se generaba con `http://localhost:4000`; GitHub rechaza hooks no públicos y los eventos `installation`/`installation_repositories` en `default_events`.
- **Solución:** guard de URL pública con mensaje claro; el manifest ya solo declara `pull_request`.
- **Tests:** ✅ 103 OK (core 35, github 17, railway 7, api 44).

**Tiempo Ahorrado**: ~1h (IA: 5m vs Humano: 1h)
