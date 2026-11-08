# Product & Agreements

Guardar en: `.quinoto-spec/discovery/08-product-and-agreements.md`

## Visión de Producto

**Quinoto Software Factory** es una aplicación web open source y self-hosted que convierte a
OpenCode y QuinotoSpec en una fábrica de software operable desde una UI. El usuario conecta un
repositorio de GitHub, elige un objetivo de producto y la app orquesta el ciclo completo:
discovery → propuesta → user stories → tareas → implementación con agentes → Pull Request →
deploy en Railway.

El producto no reemplaza a OpenCode ni a QuinotoSpec: los integra, los hace observables y los
vuelve utilizables por equipos que no quieren operar CLI, ramas y contenedores a mano.

**Principios de producto:**

- Self-hosted y open source: el usuario es dueño de sus credenciales y de su infraestructura.
- Trazabilidad: cada acción del agente queda asociada a un artefacto de QuinotoSpec y a un commit/PR.
- Reversibilidad: todo cambio pasa por branch + PR; nada se escribe directo en la rama principal.
- Progreso visible: el estado del workflow se refleja en la UI, no en logs crípticos.
- Integraciones por adaptador: GitHub y Railway en v1; el resto entra sin reescribir el core.

## Business Goals / KPIs

- Validar que un usuario pueda ir de "repo conectado" a "PR abierto" sin tocar la terminal.
- Reducir el tiempo de arranque de un proyecto nuevo a menos de 15 minutos.
- Lograr que al menos el 70% de las sesiones de agente terminen en un PR revisable.
- Mantener el costo de infraestructura por sesión dentro de un presupuesto controlado por el usuario.

## Definition of Ready (DoR)

Un ítem (propuesta, user story o tarea) está **Ready** para entrar en implementación cuando:

- [ ] Está vinculado a un PRD o a un acuerdo de producto vigente, y el problema/valor está explícito.
- [ ] El alcance y el **out of scope** están delimitados; no hay ambigüedad sobre qué se construye.
- [ ] Los dominios/servicios afectados y los archivos principales están identificados.
- [ ] Los criterios de aceptación son verificables (GIVEN/WHEN/THEN o checklist medible).
- [ ] Las dependencias externas (GitHub, Railway, OpenCode, proveedor LLM) y las credenciales necesarias están identificadas por variable de entorno, nunca hardcodeadas.
- [ ] Los riesgos tienen mitigación y las preguntas abiertas están resueltas o aceptadas explícitamente.
- [ ] Existe un plan de verificación: tests manuales, tests automatizados y criterio de éxito medible.
- [ ] Para UI: están definidos los estados vacío, loading, error y éxito, y el flujo principal.
- [ ] Para datos: el modelo y las migraciones están definidos y son reversibles.
- [ ] El prefijo está registrado, el ID es canónico y la estimación existe.
- [ ] Si aplica un gate humano, la aprobación está registrada en `.quinoto-spec/approvals/`.

## Definition of Done (DoD)

Un ítem está **Done** cuando:

- [ ] Todos los criterios de aceptación se cumplen con **evidencia fresca** (comando ejecutado + salida).
- [ ] Hay tests unitarios, de integración y/o e2e según el riesgo, y la suite pasa.
- [ ] Lint y typecheck pasan sin errores.
- [ ] El cambio se entregó por **branch + Pull Request**; nunca push directo a `main`.
- [ ] El PR incluye resumen, artefactos QuinotoSpec vinculados y checklist de revisión.
- [ ] La documentación afectada está actualizada (README, specs, delta-specs, discovery si cambió el contexto).
- [ ] Se registró la entrada de changelog correspondiente.
- [ ] Seguridad: sin secretos en repo ni en logs, tokens cifrados en reposo y permisos mínimos.
- [ ] Observabilidad: logs estructurados y errores accionables para las rutas críticas.
- [ ] Las migraciones de base de datos se probaron y tienen rollback documentado.
- [ ] El deploy en Railway se verificó cuando el cambio lo requiere.
- [ ] Si aplica un gate humano, la aprobación quedó registrada.
- [ ] Existe un plan de rollback documentado.

## Acuerdos de Producto Vigentes

| ID | Acuerdo | Estado | Fecha |
|----|---------|--------|-------|
| PA-001 | v1 es self-hosted y open source; no se ofrece SaaS multi-tenant en el alcance inicial. | Vigente | 2026-11-08 |
| PA-002 | v1 integra exclusivamente GitHub y Railway; otras integraciones quedan para v2+. | Vigente | 2026-11-08 |
| PA-003 | Los agentes OpenCode se ejecutan en contenedores efímeros sobre Railway. | Vigente | 2026-11-08 |
| PA-004 | Todo cambio producido por un agente se entrega vía Pull Request; nunca push directo a main. | Vigente | 2026-11-08 |
| PA-005 | La app nunca almacena tokens de GitHub/Railway en texto plano. | Vigente | 2026-11-08 |
| PA-006 | El proyecto se distribuye bajo GNU AGPL-3.0. | Vigente | 2026-11-08 |
