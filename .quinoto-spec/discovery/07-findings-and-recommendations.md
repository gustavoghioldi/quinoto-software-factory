# Findings & Recommendations

Guardar en: `.quinoto-spec/discovery/07-findings-and-recommendations.md`

**Discovery Date:** 2026-11-08

## Contexto del refresh

El discovery anterior se generó en el bootstrap (2026-11-08) cuando el repositorio era greenfield.
Desde entonces se agregaron 20 commits y 212 archivos: el MVP completo (F0–F6). Por eso este
refresh reconstruyó los archivos `01` a `07`; el `08` ya estaba vigente.

## Hallazgos priorizados

### Alta prioridad

| Hallazgo | Evidencia | Impacto |
|---|---|---|
| **El worker y la cola no están implementados** | `apps/worker/src/index.ts` solo imprime un log; no hay BullMQ. La orquestación corre en `apps/api/src/services`. | El diseño de la propuesta (worker + Redis + BullMQ) no se cumple; los trabajos largos viven en el proceso de la API. |
| **No hay autenticación local ni RBAC** | No hay login en `apps/api` ni en `apps/web`. | Cualquiera con acceso a la instancia puede aprobar, desplegar y cancelar. Aceptable para un operador único; riesgoso en equipo. |
| **`MAX_SESSIONS_PER_PROJECT` no se aplica** | La variable existe en `config.ts` pero no se usa en las rutas. | Se pueden iniciar sesiones concurrentes sobre el mismo proyecto. |
| **El `state` del manifest flow no se valida en el servidor** | `github-connect.tsx` genera `state` en el cliente; el callback no lo verifica. | Riesgo de CSRF en el flujo de instalación. |
| **No hay rate limiting** | Fastify no registra `@fastify/rate-limit`. | Webhooks y endpoints públicos pueden ser abusados. |

### Media prioridad

| Hallazgo | Evidencia | Impacto |
|---|---|---|
| Sin tests E2E de navegador | No hay Playwright. | Los flujos de UI se validan por build, no por interacción real. |
| Tests de API con repos en memoria | `apps/api/tests/helpers.ts` usa `InMemory*`. | No se cubren migraciones, constraints ni concurrencia real. |
| Cliente GraphQL de Railway sin validar contra la API real | `packages/adapters-railway/src/client.ts`. | El schema puede requerir ajustes. |
| Sin paginación | `GET /projects`, `/sessions/:id/events`, `/audit`. | Listas grandes pueden degradar la UI. |
| Sin logs estructurados ni OpenTelemetry | Fastify logger básico. | Difícil correlacionar request → job → sesión. |
| El contenedor web descarga pnpm al arrancar | `infra/web.Dockerfile` usa `pnpm start` con corepack. | Arranque más lento; conviene Next standalone. |
| Reconciliación de sesiones sin scheduler | `reconcileTimeouts`/`reconcileOrphans` existen pero nadie las invoca periódicamente. | Runners huérfanos o sesiones vencidas pueden quedar activos. |

### Baja prioridad

| Hallazgo | Evidencia | Impacto |
|---|---|---|
| `packages/ui` es un stub | Solo exporta `cx`. | No hay design system compartido. |
| UI con estilos inline | `apps/web/**`. | Difícil mantener consistencia visual y accesibilidad. |
| Sin i18n | Textos en español hardcodeados. | No hay soporte multi-idioma. |
| Versión `0.0.0` sin tag | `package.json`. | No hay release formal. |
| Telemetría declarada pero no implementada | `TELEMETRY_ENABLED`. | No es un problema; solo no hay métricas de adopción. |

## Recomendaciones

### Corto plazo (alta)

1. **Implementar el worker con BullMQ** y mover la orquestación fuera de la API.
2. **Aplicar `MAX_SESSIONS_PER_PROJECT`** en el inicio de sesión y devolver `409` si se excede.
3. **Validar el `state` del manifest flow** con un token firmado o almacenado en servidor.
4. **Agregar `@fastify/rate-limit`** a webhooks y endpoints públicos.
5. **Agregar autenticación local mínima** (usuario/contraseña o token de operador) antes de exponer la instancia a una red.

### Medio plazo (media)

6. **Tests E2E con Playwright** para onboarding → workflow → diff → PR.
7. **Testcontainers** para migraciones y repositorios Postgres reales.
8. **Validar el cliente de Railway** con un token real y ajustar el schema.
9. **Paginación** en listados y eventos.
10. **Logs estructurados con correlation ID** y, opcionalmente, OpenTelemetry.
11. **Scheduler de reconciliación** en el worker (timeout y huérfanos).
12. **Next standalone** para el runtime web.

### Largo plazo (baja)

13. Design system en `packages/ui`.
14. Auditoría de accesibilidad de la UI.
15. i18n.
16. Release `v0.1.0` con tag y notas.
17. Telemetría opt-in.

## Checklist de seguimiento

- [ ] Worker + BullMQ implementado.
- [ ] Límite de sesiones aplicado.
- [ ] State del manifest validado.
- [ ] Rate limiting activo.
- [ ] Auth local mínima.
- [ ] E2E Playwright.
- [ ] Testcontainers.
- [ ] Cliente Railway validado con token real.
- [ ] Paginación.
- [ ] Logs con correlation ID.
- [ ] Scheduler de reconciliación.
- [ ] Release v0.1.0.

## Fortalezas detectadas

- Arquitectura de puertos y adaptadores clara.
- Dominio del workflow bien aislado y testeado.
- Cifrado y redacción de secretos implementados.
- Auditoría append-only.
- CI con branch protection y 102 tests.
- Documentación de operación y release checklist.
- License audit automatizado.
