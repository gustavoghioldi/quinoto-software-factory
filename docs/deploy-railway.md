# Deploy en Railway

Guía para correr Quinoto Software Factory en Railway y usarlo desde la web.

## Arquitectura

Un proyecto de Railway con cuatro servicios:

| Servicio | Origen | Notas |
|---|---|---|
| `web` | `infra/web.Dockerfile` | Build arg `NEXT_PUBLIC_API_URL`. |
| `api` | `infra/api.Dockerfile` | Pre-deploy de migraciones. |
| `postgres` | Plugin de Railway | `DATABASE_URL` inyectada. |
| `redis` | Plugin de Railway | `REDIS_URL` inyectada. |

Opcional: `caddy` para servir web y API bajo un mismo dominio.

## Variables de entorno

### API

```env
NODE_ENV=production
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
FACTORY_MASTER_KEY=<openssl rand -base64 32>
FACTORY_BASE_URL=https://<api>.up.railway.app
CORS_ORIGINS=https://<web>.up.railway.app
GITHUB_APP_NAME=quinoto-software-factory
RAILWAY_API_TOKEN=<token con permiso para crear servicios>
RAILWAY_RUNNER_IMAGE=ghcr.io/quinoto/factory-runner:latest
OPENCODE_MODEL_API_KEY=<api key del proveedor LLM>
MAX_SESSION_MINUTES=30
```

### Web

```env
NEXT_PUBLIC_API_URL=https://<api>.up.railway.app
```

> `NEXT_PUBLIC_API_URL` se inlinea en build time. Cambiarlo requiere rebuild del servicio `web`.

## Migraciones

El servicio `api` debe ejecutar las migraciones antes de arrancar. Opciones:

1. **Pre-deploy command** en Railway:
   ```bash
   cd /app && pnpm --filter @factory/db db:migrate
   ```
2. **Servicio one-off** con la misma imagen:
   ```bash
   pnpm --filter @factory/db db:migrate
   ```
3. **Manual** desde la CLI:
   ```bash
   railway run --service api pnpm --filter @factory/db db:migrate
   ```

## GitHub App

Con `FACTORY_BASE_URL=https://<api>.up.railway.app`:

- Redirect del manifest: `https://<api>.up.railway.app/github/manifest/callback`
- Callback de instalación: `https://<api>.up.railway.app/github/callback`
- Webhook: `https://<api>.up.railway.app/webhooks/github`

El manifest se genera en `GET /github/manifest` y la web lo envía a GitHub.

## Runner de agentes

El adaptador crea servicios efímeros a partir de `RAILWAY_RUNNER_IMAGE`. Para que funcione:

1. Construir la imagen:
   ```bash
   docker build -f infra/runner/Dockerfile -t ghcr.io/quinoto/factory-runner:latest infra/runner
   ```
2. Publicarla en un registry accesible por Railway (GHCR, Docker Hub, etc.).
3. Configurar `RAILWAY_RUNNER_IMAGE` con esa referencia.

Sin imagen publicada, el resto de la app funciona pero las sesiones de agente no pueden provisionar runners.

## Costos

- Railway cobra por uso de CPU/RAM y almacenamiento.
- Los runners son contenedores efímeros: consumen mientras dura la sesión.
- Configurar `MAX_SESSION_MINUTES` y `MAX_SESSIONS_PER_PROJECT` para acotar el gasto.

## Verificación

```bash
curl https://<api>.up.railway.app/healthz
curl https://<api>.up.railway.app/readyz
```

Luego abrir `https://<web>.up.railway.app` y conectar GitHub.

## Limitaciones conocidas

- No hay auth local/RBAC: la instancia asume un operador único.
- El worker/BullMQ no está implementado; la orquestación corre en la API.
- `MAX_SESSIONS_PER_PROJECT` todavía no se aplica.
- El cliente GraphQL de Railway puede necesitar ajustes contra la API real.
