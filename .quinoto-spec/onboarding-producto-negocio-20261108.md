# 👋 Guía de Onboarding — Quinoto Software Factory

> **Rol**: Producto / Negocio
> **Generado**: 2026-11-08
> **Discovery base**: 2026-11-08 (actualizado)

---

## 🗺️ ¿Qué es este producto?

**Quinoto Software Factory** es una aplicación web **open source y self-hosted** que ordena y hace
visible el trabajo de construir software con agentes de IA. La organización la instala en su propia
infraestructura, conecta un repositorio de GitHub y usa una UI para ejecutar un proceso completo:
descubrir el contexto → escribir una propuesta → bajarla a historias y tareas → implementar con
agentes → revisar el cambio → abrir un Pull Request → publicar en Railway.

No es un IDE ni un agente nuevo. Es el **plano de control** que une OpenCode (el motor de agentes)
con QuinotoSpec (el proceso y los artefactos), y que convierte una práctica artesanal de terminal
en un flujo observable, repetible y auditable.

**En una frase:** la fábrica no reemplaza al equipo; le da orden, visibilidad y trazabilidad.

---

## 🎯 El problema y la propuesta de valor

### El problema

Hoy, un equipo que quiere usar agentes para construir software serio tiene que:

- Abrir la terminal, clonar el repo y lanzar sesiones a mano.
- Copiar y pegar prompts y resultados.
- Respetar de memoria el orden del proceso.
- Crear ramas, commits y PRs manualmente.
- Desplegar en otra herramienta.
- Reconstruir qué pasó cuando algo falla.

Cada persona lo hace distinto. El estado del proceso queda en archivos que nadie mira. No hay
trazabilidad entre lo que decidió el agente y lo que terminó en el repositorio.

### La propuesta de valor

- **Un solo lugar** para conectar repo, proceso, agente, revisión y deploy.
- **Progreso visible:** la UI muestra en qué etapa está cada proyecto y qué está haciendo el agente.
- **Trazabilidad:** cada cambio queda vinculado a un artefacto, una sesión, un commit y un PR.
- **Reversibilidad:** todo sale por Pull Request; nunca se escribe directo en `main`.
- **Control del operador:** credenciales, infraestructura y costos quedan en manos de la organización.

---

## 👥 ¿Para quién es?

| Persona | Perfil | Qué necesita | Qué le duele hoy |
|---|---|---|---|
| **Sofía** | Dev fullstack independiente, early adopter open source | Ir de una idea a un PR sin cambiar de contexto y ver al agente trabajar | Ceremonia git, sesiones desincronizadas, no saber en qué paso está |
| **Marcos** | Tech lead de un equipo chico (3–8 devs) | Estandarizar el uso de agentes y revisar antes de mergear | Cada dev lo hace a su manera, sin auditoría ni contexto en los PRs |
| **Ana** | Platform / DevOps engineer, self-hoster | Instalar con Compose, cuidar tokens y costos, ver logs | Miedo a filtrar secretos, costos fuera de control, debugging difícil |
| **Lucía** | Product owner no técnica | Ver estado, leer propuestas y aprobar desde la UI | No puede leer logs de CLI, se entera tarde de los desvíos |

**Audiencia principal de la v1:** comunidad open source (developers, maintainers y self-hosters).

---

## ✅ ¿Qué incluye la v1?

La primera versión completa ya está construida. En lenguaje de producto:

1. **Conexión con GitHub:** la organización instala una GitHub App y elige repositorio y branch.
2. **Workspace de proyecto:** cada proyecto representa un repo conectado.
3. **Proceso ordenado:** discovery → propuesta → historias → tareas → implementación.
4. **Gates y aprobaciones:** las etapas no avanzan sin artefactos ni aprobación humana.
5. **Sesiones de agente:** el agente trabaja en un contenedor aislado y se ve en vivo.
6. **Revisión de cambios:** diff por archivo y apertura de Pull Request con contexto.
7. **Deploy:** vínculo con Railway, disparo y estado del deploy.
8. **Dashboard multi-proyecto:** etapa, sesiones, PRs y deploy en una sola vista.
9. **Auditoría y seguridad:** registro de acciones, tokens cifrados y secretos redactados.
10. **Self-hosted:** instalación con Docker Compose y migraciones automáticas.

### Lo que queda fuera de la v1

SaaS multi-tenant, billing, app móvil, IDE embebido, auto-merge sin revisión, GitLab/Bitbucket,
Vercel, runner local, SSO empresarial y certificaciones de compliance.

---

## 📊 Estado actual

| Dimensión | Estado |
|---|---|
| Producto | MVP v1 completo (F0–F6) |
| Historias / tareas | 19 historias · 78 tareas completadas |
| Calidad | 103 tests automáticos · CI en verde |
| Documentación | PRD, propuesta, design, 7 specs, discovery completo, onboarding |
| Licencia | AGPL-3.0 |
| Repositorio | `github.com/gustavoghioldi/quinoto-software-factory` |
| Deploy de la instancia | Railway (web + API + Postgres + Redis) |
| Propuestas activas | Ninguna: el MVP está completo y archivado |

### URLs de la instancia desplegada

- **Web:** https://web-production-081b4.up.railway.app
- **API:** https://api-production-1ea0.up.railway.app

### Qué falta para uso real con agentes

1. Crear la **GitHub App** desde la web.
2. Configurar un **token de Railway** para runners y deploys reales.
3. Publicar la **imagen del runner** de OpenCode.
4. Configurar la **API key del proveedor LLM**.
5. Definir **autenticación local/RBAC** antes de abrir la instancia a un equipo.

---

## 📈 KPIs y métricas

| Objetivo | Métrica | Target | Estado actual |
|---|---|---|---|
| O1. Onboarding sin terminal | Tiempo desde instancia lista hasta primer PR | ≤ 15 min | No instrumentado |
| O2. Workflow confiable | % de sesiones que terminan en PR revisable | ≥ 70% | No instrumentado |
| O3. Trazabilidad total | % de PRs con artefacto y sesión vinculados | 100% | Diseñado; falta medir |
| O4. Self-host simple | Tiempo de instalación con Compose | ≤ 30 min | Verificado en local; falta medir con usuarios |
| O5. Costo bajo control | Costo mediano por sesión + cap | Visible y con tope | Parcial: configuración existe, medidor no |
| O6. Adopción inicial | Instancias activas con ≥1 proyecto y PR en 30 días | 50 instancias | Pre-lanzamiento |
| O7. Retención | % de proyectos con actividad semanal | ≥ 40% | Pre-lanzamiento |

**Nota de producto:** los KPIs están definidos, pero la instrumentación de adopción y costo
todavía no existe. Es una prioridad para poder validar la v1 con usuarios reales.

---

## 📋 Acuerdos de producto vigentes

| ID | Acuerdo | Estado |
|---|---|---|
| PA-001 | La v1 es self-hosted y open source; no hay SaaS multi-tenant. | Vigente |
| PA-002 | La v1 integra exclusivamente GitHub y Railway. | Vigente |
| PA-003 | Los agentes OpenCode corren en contenedores efímeros sobre Railway. | Vigente |
| PA-004 | Todo cambio se entrega por Pull Request; nunca push directo a `main`. | Vigente |
| PA-005 | La app nunca almacena tokens en texto plano. | Vigente |
| PA-006 | El proyecto se distribuye bajo GNU AGPL-3.0. | Vigente |

### Definition of Ready (DoR)

Un ítem está listo para implementación cuando tiene problema/valor explícito, alcance y out of scope,
servicios y archivos afectados, criterios verificables, dependencias y credenciales, riesgos con
mitigación, plan de verificación, estados de UI, modelo de datos, prefijo/ID y aprobación humana
cuando aplica. Ver `.quinoto-spec/discovery/08-product-and-agreements.md`.

### Definition of Done (DoD)

Un ítem está terminado cuando cumple los criterios con evidencia fresca, tiene tests y CI verde,
lint/typecheck OK, se entregó por branch + PR, actualizó documentación y changelog, no filtró
secretos, tiene observabilidad, migraciones probadas, deploy verificado cuando aplica y rollback
documentado. Ver `.quinoto-spec/discovery/08-product-and-agreements.md`.

---

## 🗺️ Roadmap

### v2 — Ampliar alcance

- GitLab y Bitbucket como proveedores Git.
- Vercel como destino de deploy.
- RBAC por equipo (admin/dev/viewer).
- Runner local para organizaciones que no quieren usar Railway.

### v2.1 — Operación y adopción

- Notificaciones (email/webhook/Slack).
- Plantillas de proyecto.
- Medidor de costo avanzado con topes.

### v3 — Escala

- Federación multi-repo (Bifrost).
- Marketplace de agentes y plantillas.
- Aprobaciones multi-firma.

---

## ⚠️ Riesgos y decisiones abiertas (visión producto)

| Tema | Riesgo / pregunta | Impacto |
|---|---|---|
| Autenticación | La instancia no tiene login ni RBAC; cualquiera con la URL puede operar. | Alto para equipos; aceptable para un operador único. |
| Métricas | Adopción, retención y costo no están instrumentados. | No se puede validar el product-market fit. |
| Runner real | La imagen del runner y el token de Railway no están configurados. | Las sesiones de agente no ejecutan trabajo real todavía. |
| Licencias de dependencias | OpenCode y QuinotoSpec deben ser compatibles con la distribución AGPL. | Puede afectar el lanzamiento open source. |
| Modelo de negocio | No hay pricing ni plan comercial definido. | La v1 es open source; falta decidir sostenibilidad. |
| Alcance | GitLab/Vercel/RBAC están fuera de la v1. | Puede limitar la adopción en equipos grandes. |

---

## 🧭 Primeros pasos sugeridos para Producto

1. [ ] Leer el PRD completo: `.quinoto-spec/prd/quinoto-software-factory/prd.md`.
2. [ ] Revisar los acuerdos y el DoR/DoD en `.quinoto-spec/discovery/08-product-and-agreements.md`.
3. [ ] Probar la instancia desplegada en https://web-production-081b4.up.railway.app.
4. [ ] Crear la GitHub App desde la web y conectar un repo de prueba.
5. [ ] Definir la instrumentación de los KPIs O1–O7 (adopción, sesiones→PR, costo).
6. [ ] Priorizar la v2: auth/RBAC para equipos, runner real y medidor de costo.
7. [ ] Acordar el modelo de sostenibilidad del proyecto open source.

---

## 📚 Recursos

| Recurso | Ubicación |
|---|---|
| PRD (visión, personas, KPIs, alcance) | `.quinoto-spec/prd/quinoto-software-factory/prd.md` |
| Acuerdos y DoR/DoD | `.quinoto-spec/discovery/08-product-and-agreements.md` |
| Discovery completo | `.quinoto-spec/discovery/` |
| Specs vigentes | `.quinoto-spec/specs/` |
| Propuesta y design del MVP | `.quinoto-spec/proposals/_archived/2026-11-08-quinoto-software-factory-mvp/` |
| Changelog | `.quinoto-spec/changelog/` |
| Operación y deploy | `docs/operations.md` · `docs/deploy-railway.md` |
| Release checklist | `docs/release-checklist.md` |

---

## 📖 Glosario mínimo

| Término | Qué significa |
|---|---|
| **Self-hosted** | Cada organización instala y opera su propia copia. |
| **Open source** | El código es público y se distribuye bajo AGPL-3.0. |
| **Pull Request (PR)** | Propuesta de cambio que una persona revisa antes de aceptar. |
| **Agente** | Programa de IA que ejecuta tareas de código. |
| **Runner** | Contenedor aislado donde trabaja el agente. |
| **Gate** | Control que impide avanzar sin un artefacto o una aprobación. |
| **Artefacto** | Documento del proceso: propuesta, historias, tareas, diff. |

---

_Generado por `@quinotospec.onboard` · QuinotoSpec_
