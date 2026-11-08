# Release checklist

Antes de publicar una versión self-hosted:

- [ ] `pnpm lint` sin errores.
- [ ] `pnpm typecheck` sin errores.
- [ ] `pnpm test` en verde.
- [ ] `pnpm build` en verde.
- [ ] `./scripts/license-audit.sh` pasa.
- [ ] Migraciones nuevas generadas y aplicadas en una instancia limpia.
- [ ] `./scripts/smoke-compose.sh` pasa.
- [ ] Changelog actualizado con `quinotospec-update-changelog`.
- [ ] Versión bumpeada en `package.json`.
- [ ] README y `docs/operations.md` actualizados.
- [ ] Tag `vX.Y.Z` creado y pusheado.
- [ ] Release notes publicadas en GitHub.
