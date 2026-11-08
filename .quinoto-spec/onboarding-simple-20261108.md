# 👋 Guía de Onboarding — Quinoto Software Factory

> **Rol**: Simple (explicado sin jerga)
> **Generado**: 2026-11-08
> **Discovery base**: incompleto (`02-overview.md` y `08-product-and-agreements.md`)

> ⚠️ **Aviso importante**: el discovery del proyecto quedó viejo. Se escribió antes de construir el MVP y todavía dice “greenfield”. Para esta guía usé también el README, las specs, el changelog y el estado real del repositorio. Si querés el discovery al día, ejecutá `@quinotospec.refresh-discovery`.

---

## 🧸 ¿Qué es este proyecto, en palabras simples?

Imaginá una fábrica de software. No una fábrica de muebles: una fábrica donde entran ideas y salen cambios de código revisados.

**Quinoto Software Factory** es el “tablero de control” de esa fábrica. Es una aplicación web que instalás en tu propia computadora o servidor. Desde una pantalla, conectás un proyecto de GitHub, elegís qué querés construir y la fábrica se encarga de:

1. Ordenar el trabajo en pasos.
2. Pedirle a un robot (OpenCode) que haga el trabajo pesado.
3. Mostrarte lo que el robot está haciendo en vivo.
4. Entregar el resultado como una propuesta de cambio (Pull Request) para que una persona lo revise.
5. Si querés, publicar la aplicación en Railway.

La fábrica no reemplaza a las personas: les ordena el trabajo y les muestra qué está pasando.

---

## 🎯 ¿Qué problema resuelve?

Sin la fábrica, una persona tiene que:

- Abrir la terminal.
- Clonar el repositorio.
- Escribir instrucciones al robot.
- Copiar y pegar resultados.
- Crear una rama.
- Abrir un Pull Request.
- Publicar la app.

Todo a mano, en herramientas distintas, y sin un registro claro de qué pasó.

Con la fábrica, eso se hace desde una pantalla, queda registrado y se entrega de forma ordenada.

---

## 🧱 ¿Cómo está armada? (con analogías)

La fábrica tiene varias partes. Pensalas como las áreas de un taller:

| Parte | Nombre técnico | Qué hace, en simple |
|---|---|---|
| La recepción | `web` (Next.js) | Es la pantalla que ves. Muestra proyectos, botones y estados. |
| El mensajero | `api` (Fastify) | Recibe tus pedidos y los pasa al resto del taller. |
| El capataz | `worker` / orquestador | Decide qué paso sigue y controla que no se salteen pasos. |
| El cuaderno | PostgreSQL | Anota todo: proyectos, sesiones, aprobaciones y errores. |
| La fila de turnos | Redis | Organiza los trabajos que esperan su turno. |
| El robot | `factory-runner` (OpenCode) | Hace el trabajo pesado dentro de una caja aislada. |
| La biblioteca | GitHub | Es donde vive el código y donde se revisan los cambios. |
| La sala de exposición | Railway | Es donde se publica la app terminada (opcional). |

### Una regla de oro

**La fábrica nunca escribe directamente en la rama principal (`main`).** Siempre propone el cambio en una rama aparte y lo entrega como Pull Request. Así una persona puede revisar antes de aceptar.

---

## 🚀 ¿Cómo levantarlo en tu computadora?

### Lo que necesitás instalar

- **Docker** y **Docker Compose** (para levantar todo junto).
- **Node.js 22 o superior**.
- **pnpm 10 o superior**.

### Paso a paso

```bash
# 1. Entrar al proyecto
cd quinoto-software-factory

# 2. Instalar dependencias
pnpm install

# 3. Copiar el archivo de ejemplo de configuración
cp .env.example .env

# 4. Completar los valores del archivo .env
#    (te explico abajo cuáles son importantes)

# 5. Levantar todo con Docker
docker compose -f infra/docker-compose.yml up -d --build
```

Cuando termina, abrís:

- La pantalla: http://localhost:3000
- La API: http://localhost:4000/healthz

Para apagarlo:

```bash
docker compose -f infra/docker-compose.yml down
```

### Para desarrollar con recarga automática

```bash
pnpm dev
```

### Para correr las pruebas

```bash
pnpm test
```

---

## 🔑 Las claves importantes (variables de entorno)

Pensá en el archivo `.env` como la agenda de contactos y contraseñas de la fábrica.

| Variable | Para qué sirve | ¿Obligatoria? |
|---|---|---|
| `FACTORY_MASTER_KEY` | Es la llave maestra que protege las demás contraseñas. | Sí, en producción. |
| `DATABASE_URL` | Dónde está el cuaderno (PostgreSQL). | Sí. |
| `REDIS_URL` | Dónde está la fila de turnos (Redis). | Sí. |
| `FACTORY_BASE_URL` | La dirección pública de la fábrica. Necesaria para que GitHub le avise cosas. | Sí, si usás GitHub real. |
| `GITHUB_APP_ID`, `GITHUB_PRIVATE_KEY`, `GITHUB_WEBHOOK_SECRET` | Credenciales de la app de GitHub. | Sí, para GitHub real. |
| `RAILWAY_API_TOKEN` | Llave para crear robots y publicar en Railway. | No. Sin esto se usa un simulador. |
| `OPENCODE_MODEL_API_KEY` | Llave para que el robot pueda pensar. | Sí, para sesiones reales. |

Para generar la llave maestra:

```bash
openssl rand -base64 32
```

> 🔒 **Importante:** nunca subas el archivo `.env` a GitHub. La fábrica cifra las contraseñas y tapa los secretos en los logs, pero el archivo `.env` es tuyo y no se comparte.

---

## ✅ ¿Qué se puede hacer hoy?

El MVP (la primera versión completa) ya está terminado. Hoy se puede:

- Conectar un repositorio de GitHub.
- Crear un proyecto dentro de la fábrica.
- Ejecutar el proceso ordenado: descubrir → proponer → escribir historias → crear tareas → implementar.
- Ver al robot trabajar en vivo, con logs.
- Cancelar una sesión si algo sale mal.
- Revisar los cambios y abrir un Pull Request.
- Vincular un proyecto a Railway y pedir un deploy.
- Ver un tablero con todos los proyectos.
- Revisar un registro de lo que pasó (auditoría).
- Instalar todo con Docker Compose.

---

## 📊 ¿Qué está terminado y qué falta?

### Terminado

| Etapa | Qué se hizo |
|---|---|
| F0 | Base del proyecto: carpetas, pruebas, Docker. |
| F1 | Conexión con GitHub y creación de proyectos. |
| F2 | Proceso ordenado con pasos y aprobaciones. |
| F3 | Robots que trabajan en cajas aisladas, con logs en vivo. |
| F4 | Revisión de cambios y Pull Requests. |
| F5 | Publicación en Railway y tablero de proyectos. |
| F6 | Seguridad, auditoría y documentación de operación. |

**Números:** 19 historias, 78 tareas, 102 pruebas automáticas, 13 Pull Requests mergeados.

### Lo que falta para usarlo “de verdad”

1. Crear una **GitHub App** real y darle una dirección pública a la fábrica.
2. Poner un **token real de Railway** (si no, se usa un simulador).
3. Poner una **llave del proveedor de IA** para que el robot pueda trabajar.
4. Generar la **llave maestra** y configurarla.
5. Publicar una versión con número (`v0.1.0`) y notas de release.

---

## 📖 Palabras raras, explicadas

| Palabra | Qué significa, en simple |
|---|---|
| **Repositorio** | La carpeta del proyecto en GitHub, con todo su historial. |
| **Rama (branch)** | Una copia paralela del proyecto para probar cambios sin romper lo principal. |
| **Pull Request (PR)** | Una propuesta de cambio: “mirá estos cambios y decidí si los aceptás”. |
| **Commit** | Una foto de un cambio, con un mensaje que explica qué se hizo. |
| **Contenedor** | Una caja aislada donde corre un programa sin mezclarse con el resto. |
| **Docker** | La herramienta que arma y hace funcionar esas cajas. |
| **API** | La puerta por donde la pantalla le pide cosas al resto del sistema. |
| **Base de datos** | El cuaderno donde se guarda la información importante. |
| **Deploy** | Publicar la aplicación para que otras personas puedan usarla. |
| **Webhook** | Un aviso automático que GitHub le manda a la fábrica cuando pasa algo. |
| **Token** | Una contraseña temporal que permite hacer algo puntual. |

---

## 🧭 Tus primeros pasos

1. [ ] Instalá Docker, Node.js y pnpm.
2. [ ] Cloná el repositorio y ejecutá `pnpm install`.
3. [ ] Copiá `.env.example` a `.env` y completá las claves.
4. [ ] Levantá todo con Docker Compose y abrí http://localhost:3000.
5. [ ] Corré `pnpm test` para confirmar que todo funciona.
6. [ ] Leé `docs/operations.md` para entender instalación, actualización y respaldos.
7. [ ] Mirá `.quinoto-spec/specs/` para entender qué debe hacer cada parte.
8. [ ] Si vas a tocar código, leé `README.md` y `AGENTS.md`.

---

## 📚 ¿Dónde mirar si querés más?

| Quiero saber... | Ir a... |
|---|---|
| Cómo está armado el proyecto | `README.md` |
| Cómo instalarlo y operarlo | `docs/operations.md` |
| Qué debe hacer cada parte | `.quinoto-spec/specs/` |
| Qué se hizo y cuándo | `.quinoto-spec/changelog/` |
| La historia completa del MVP | `.quinoto-spec/proposals/_archived/2026-11-08-quinoto-software-factory-mvp/` |
| Los acuerdos del equipo | `.quinoto-spec/discovery/08-product-and-agreements.md` |
| El producto y sus objetivos | `.quinoto-spec/prd/quinoto-software-factory/prd.md` |

---

## 🫶 Una última cosa

Este proyecto ya tiene una primera versión completa. No hace falta que entiendas todo de golpe. Empezá por levantarlo, mirar la pantalla y correr las pruebas. Después, de a una parte por vez.

Si algo no funciona, no es tu culpa: es una pista de dónde mirar. Los logs y la documentación están para ayudarte.

---

_Generado por `@quinotospec.onboard` · QuinotoSpec_
