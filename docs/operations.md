# Operación self-hosted

Guía para instalar, actualizar, respaldar y diagnosticar una instancia de Quinoto Software Factory.

## Requisitos

- Docker Engine 24+ y Docker Compose v2.
- 2 vCPU y 4 GB de RAM como mínimo.
- Un dominio o túnel para `FACTORY_BASE_URL` (necesario para webhooks de GitHub).
- Cuenta de GitHub y, opcionalmente, token de Railway y API key de un proveedor LLM.

## Variables de entorno

| Variable               | Requerida        | Descripción                                       |
| ---------------------- | ---------------- | ------------------------------------------------- |
| `FACTORY_BASE_URL`     | Sí en producción | URL pública de la API (webhooks y manifest).      |
| `FACTORY_MASTER_KEY`   | Sí en producción | Clave de 32 bytes en base64 para cifrar secretos. |
| `DATABASE_URL`         | Sí               | Conexión PostgreSQL.                              |
| `REDIS_URL`            | Sí               | Conexión Redis.                                   |
| `CORS_ORIGINS`         | No               | Orígenes permitidos, separados por coma.          |
| `GITHUB_APP_NAME`      | No               | Nombre de la GitHub App.                          |
| `RAILWAY_API_TOKEN`    | No               | Si falta, se usa el mock de Railway.              |
| `RAILWAY_RUNNER_IMAGE` | No               | Imagen del runner efímero.                        |
| `MAX_SESSION_MINUTES`  | No               | Límite por sesión (default 30).                   |

Generar la master key:

```bash
openssl rand -base64 32
```

## Instalación

```bash
git clone https://github.com/gustavoghioldi/quinoto-software-factory.git
cd quinoto-software-factory
cp .env.example .env
# editar .env
docker compose -f infra/docker-compose.yml up -d --build
```

Verificar:

```bash
curl http://localhost:4000/healthz
curl http://localhost:4000/readyz
docker compose -f infra/docker-compose.yml ps
```

El servicio `migrate` aplica las migraciones antes de arrancar la API.

## Actualización

```bash
git pull
docker compose -f infra/docker-compose.yml up -d --build
docker compose -f infra/docker-compose.yml logs migrate
```

Las migraciones son idempotentes. Si un upgrade falla:

```bash
docker compose -f infra/docker-compose.yml down
# volver al tag anterior
git checkout <tag-anterior>
docker compose -f infra/docker-compose.yml up -d --build
```

## Backup y restore

Backup:

```bash
docker compose -f infra/docker-compose.yml exec -T postgres \
  pg_dump -U factory -d factory -Fc > backup-$(date +%Y%m%d).dump
```

Restore en una instancia limpia:

```bash
docker compose -f infra/docker-compose.yml stop api worker
docker compose -f infra/docker-compose.yml exec -T postgres \
  pg_restore -U factory -d factory --clean --if-exists < backup-YYYYMMDD.dump
docker compose -f infra/docker-compose.yml start api worker
```

## Troubleshooting

- **La API no arranca:** revisar `docker compose logs api`. Si falta `FACTORY_MASTER_KEY` en producción, el arranque falla a propósito.
- **`/readyz` devuelve 503:** Postgres o Redis no están disponibles. Revisar `docker compose ps`.
- **Webhooks no llegan:** `FACTORY_BASE_URL` debe ser pública y accesible desde GitHub.
- **Deploy de Railway falla:** revisar el token y los IDs de proyecto/servicio/entorno.
- **Sesión trabada:** cancelar desde la UI o esperar el timeout; la reconciliación destruye runners huérfanos.

## Seguridad

- No commitear `.env` ni tokens.
- Rotar `FACTORY_MASTER_KEY` invalida los secretos existentes: reconectar las integraciones.
- La app nunca escribe directo en `main`; todo cambio sale por PR.
- Los logs y eventos pasan por redacción de secretos antes de persistirse.
