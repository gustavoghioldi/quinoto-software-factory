# Architecture

Guardar en: `.quinoto-spec/discovery/03-architecture.md`

**Discovery Date:** 2026-11-08

## Diagrama conceptual

```mermaid
flowchart LR
    subgraph Browser
        UI[Next.js Web]
    end
    subgraph ControlPlane[Plano de control]
        API[Fastify API]
        WK[Worker / Orquestador]
        Q[(Redis)]
        DB[(PostgreSQL)]
    end
    subgraph External[Externos]
        GH[GitHub API]
        RA[Railway API]
        LLM[Proveedor LLM]
    end
    subgraph Runtime[Runtime efímero]
        RUN[factory-runner<br/>OpenCode + git]
    end

    UI -->|REST + SSE| API
    API --> DB
    API --> Q
    Q --> WK
    WK --> DB
    WK -->|provisiona| RA
    RA --> RUN
    WK -->|sesión / eventos| RUN
    RUN -->|clone / push| GH
    WK -->|PR / branches| GH
    WK -->|deploy| RA
    RUN -->|inferencia| LLM
    API -->|OAuth / webhooks| GH
```

## Capas y responsabilidades

| Capa | Paquete / app | Responsabilidad |
|---|---|---|
| Presentación | `apps/web` | UI, estados, SSE client. No accede a DB ni a tokens. |
| Transporte | `apps/api` | Auth de integraciones, validación, REST, SSE, webhooks, encolado. |
| Dominio | `packages/core` | Workflow, gates, artefactos, config, crypto, redacción. |
| Persistencia | `packages/db` | Schema Drizzle, repositorios Postgres y en memoria, migraciones. |
| Integraciones | `packages/adapters-github`, `packages/adapters-railway` | Contratos y clientes externos. |
| Runtime | `infra/runner` | OpenCode + git + toolchain en contenedor aislado. |
| Orquestación | `apps/worker` | Esqueleto; la lógica corre hoy en `apps/api/src/services`. |

## Patrones de diseño

- **Puertos y adaptadores:** el core no conoce GitHub ni Railway; los adaptadores implementan interfaces.
- **Repository pattern:** `GitHubInstallationRepository`, `ProjectRepository`, `WorkflowRepository`, `ArtifactRepository`, `ApprovalRepository`, `SessionStore`, `RailwayLinkRepository`, `AuditRepository`.
- **State machine:** etapas y transiciones explícitas con gates (`packages/core/src/workflow.ts`).
- **Dependency injection:** `ApiDependencies` se construye en `bootstrap.ts` y se inyecta en las rutas.
- **SSE:** logs de sesión en vivo con `Last-Event-ID`.
- **Redacción centralizada:** `redactValue` se aplica antes de persistir eventos y auditoría.

## Flujo principal (secuencia)

```mermaid
sequenceDiagram
    actor U as Usuario
    participant W as Web
    participant A as API
    participant O as Orquestador
    participant DB as PostgreSQL
    participant RA as Railway API
    participant C as factory-runner
    participant G as GitHub API

    U->>W: Conecta GitHub y elige repo
    W->>A: POST /projects
    A->>DB: Guarda proyecto
    A-->>W: Proyecto ready

    U->>W: Inicia workflow
    W->>A: POST /projects/:id/workflow/start
    A->>O: Ejecuta etapa
    O->>DB: Verifica gates
    O->>RA: Crea runner efímero
    RA-->>O: Runner listo
    O->>C: Inicia sesión OpenCode
    C->>G: Clona repo
    loop Eventos
        C-->>O: SSE
        O->>DB: Persiste eventos
        O-->>A: Publica
        A-->>W: SSE al navegador
    end
    C-->>O: Sesión completa
    O->>G: Abre Pull Request
    O->>RA: Destruye runner
    O->>DB: Estado final
    A-->>W: PR listo
```

## Componentes reutilizables

- `packages/core`: config, crypto, redacción, workflow, artefactos, sesiones.
- `packages/db`: repositorios intercambiables (memoria/Postgres).
- `packages/adapters-github`: manifest, JWT, tokens, repos, PRs, webhooks.
- `packages/adapters-railway`: runners y deploys con mock incluido.
- `packages/ui`: utilidades compartidas.

## Decisiones arquitectónicas clave

1. Monorepo TypeScript con contratos compartidos.
2. Next.js para UI y Fastify para API/SSE.
3. PostgreSQL + Drizzle con migraciones versionadas.
4. GitHub App con manifest flow y tokens de instalación.
5. Runner efímero en Railway, un contenedor por sesión.
6. AES-256-GCM con `FACTORY_MASTER_KEY`.
7. SSE para logs; sin WebSocket en v1.
8. Adaptadores aislados para permitir GitLab/Vercel en v2.

## Integraciones

| Integración | Uso | Estado |
|---|---|---|
| GitHub API | repos, branches, PRs, webhooks | Implementado; requiere credenciales reales. |
| Railway API | runners y deploys | Implementado con cliente GraphQL; validar schema con token real. |
| OpenCode | sesiones de agente | Imagen runner creada; falta orquestación real de la sesión. |
| Proveedor LLM | inferencia del agente | Requiere `OPENCODE_MODEL_API_KEY`. |
