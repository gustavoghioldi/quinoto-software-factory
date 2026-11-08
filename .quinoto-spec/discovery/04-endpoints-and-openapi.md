# Endpoints & OpenAPI

Guardar en: `.quinoto-spec/discovery/04-endpoints-and-openapi.md`

**Discovery Date:** 2026-11-08

## Resumen

La API es REST sobre Fastify 5, con un endpoint SSE para logs de sesión y un webhook para GitHub.
No hay autenticación local en v1: la instancia asume un operador único self-hosted. Las llamadas
externas se autentican con GitHub App y tokens de instalación. CORS permite los orígenes
configurados en `CORS_ORIGINS`.

## Endpoints principales

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| GET | `/healthz` | Liveness | No |
| GET | `/readyz` | Readiness con dependencias | No |
| GET | `/github/manifest` | Devuelve el manifest de la GitHub App | No |
| GET | `/github/manifest/callback` | Intercambia el código del manifest y guarda credenciales | No (flujo GitHub) |
| GET | `/github/callback` | Guarda `installation_id` tras instalar la app | No (flujo GitHub) |
| GET | `/github/repos` | Lista repositorios de la instalación | Token de instalación |
| GET | `/projects` | Lista proyectos | No |
| GET | `/projects/overview` | Agrega etapa, sesiones, PRs y deploy | No |
| POST | `/projects` | Crea un proyecto | No |
| GET | `/projects/:id/workflow` | Estado del workflow | No |
| POST | `/projects/:id/workflow/start` | Inicia el workflow | No |
| POST | `/projects/:id/workflow/advance` | Avanza de etapa (valida gates) | No |
| POST | `/projects/:id/workflow/retry` | Reintenta desde checkpoint | No |
| GET | `/approvals` | Lista aprobaciones de un proyecto | No |
| POST | `/approvals` | Registra una aprobación | No |
| POST | `/projects/:id/sessions` | Inicia una sesión de agente | No |
| GET | `/sessions/:id` | Estado de la sesión | No |
| POST | `/sessions/:id/cancel` | Cancela la sesión | No |
| GET | `/sessions/:id/events` | Lista eventos | No |
| GET | `/sessions/:id/events/stream` | Stream SSE de eventos | No |
| GET | `/sessions/:id/diff` | Último diff de la sesión | No |
| POST | `/sessions/:id/pull-request` | Abre un Pull Request | Token de instalación |
| POST | `/projects/:id/railway` | Vincula proyecto/servicio/entorno de Railway | No |
| GET | `/projects/:id/railway` | Lee el vínculo de Railway | No |
| POST | `/projects/:id/deploy` | Dispara un deploy | Token de Railway |
| GET | `/projects/:id/deploy` | Estado del último deploy | Token de Railway |
| GET | `/audit` | Auditoría de un proyecto (solo lectura) | No |
| POST | `/webhooks/github` | Webhook de GitHub | Firma HMAC |

## OpenAPI mínimo

```yaml
openapi: 3.1.0
info:
  title: Quinoto Software Factory API
  version: 0.0.0
  description: Plano de control self-hosted para OpenCode + QuinotoSpec.
servers:
  - url: http://localhost:4000
paths:
  /healthz:
    get:
      summary: Liveness
      responses:
        "200": { description: OK }
  /readyz:
    get:
      summary: Readiness
      responses:
        "200": { description: Dependencias sanas }
        "503": { description: Dependencia caída }
  /projects:
    get:
      summary: Lista proyectos
      responses:
        "200": { description: Lista de proyectos }
    post:
      summary: Crea un proyecto
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [name, repoFullName, defaultBranch]
              properties:
                name: { type: string }
                repoFullName: { type: string, example: acme/web }
                defaultBranch: { type: string, example: main }
      responses:
        "201": { description: Proyecto creado }
        "409": { description: GitHub App no instalada }
  /projects/{id}/workflow/start:
    post:
      summary: Inicia el workflow
      parameters:
        - name: id
          in: path
          required: true
          schema: { type: string, format: uuid }
      responses:
        "200": { description: Workflow iniciado }
        "404": { description: Proyecto no encontrado }
  /sessions/{id}/events/stream:
    get:
      summary: Stream SSE de eventos
      parameters:
        - name: id
          in: path
          required: true
          schema: { type: string, format: uuid }
      responses:
        "200":
          description: Stream de eventos
          content:
            text/event-stream:
              schema: { type: string }
  /webhooks/github:
    post:
      summary: Webhook de GitHub
      parameters:
        - name: X-Hub-Signature-256
          in: header
          required: true
          schema: { type: string }
      responses:
        "200": { description: Aceptado }
        "401": { description: Firma inválida }
```

## Notas de autenticación

- **GitHub:** la app se autentica con JWT RS256 y tokens de instalación de corta duración.
- **Railway:** token del operador en `RAILWAY_API_TOKEN`; si falta, se usa el mock.
- **Local:** no hay login ni RBAC en v1. Cualquiera con acceso a la instancia puede operar.
- **Webhooks:** se valida `X-Hub-Signature-256` con HMAC SHA-256 antes de procesar.
- **CORS:** orígenes permitidos por `CORS_ORIGINS` (default `localhost:3000` y `127.0.0.1:3000`).

## Recomendaciones de pruebas de integración

- Cubrir cada ruta con Fastify `inject` y dependencias en memoria (ya hay 43 tests de API).
- Añadir tests con Postgres/Redis reales (Testcontainers) para migraciones y concurrencia.
- Probar el webhook con firma válida, inválida y payload grande.
- Probar SSE con reconexión y `Last-Event-ID`.
- Añadir tests de contrato contra la API real de Railway cuando haya token.
