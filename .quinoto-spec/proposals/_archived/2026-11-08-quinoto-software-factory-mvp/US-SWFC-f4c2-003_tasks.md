# Plan de Tareas (Quinoto Software Factory MVP — US-SWFC-f4c2-003)

**Proposal ID:** 2026-11-08-quinoto-software-factory-mvp
**Prefijo:** SWFC-f4c2
**Estado:** proposed

| ID | Tipo | Título | Descripción | Historia Relacionada | Servicio | Archivos a Modificar | Estimación | Prioridad | Dependencias | Estado |
|---|---|---|---|---|---|---|---|---|---|---|
| TSK-SWFC-f4c2-008 | DevOps | Crear Docker Compose base | Servicios web, api, worker, postgres y redis con redes y variables compartidas. | US-SWFC-f4c2-003 | platform | infra/docker-compose.yml | M | P1 | TSK-SWFC-f4c2-001 | [x] |
| TSK-SWFC-f4c2-009 | Config | Definir `.env.example` y validación | Documentar variables requeridas y validarlas al arranque con mensajes accionables. | US-SWFC-f4c2-003 | platform | .env.example, apps/api/src/config.ts | S | P1 | TSK-SWFC-f4c2-008 | [x] |
| TSK-SWFC-f4c2-010 | DevOps | Agregar healthchecks y volúmenes | Healthchecks de Postgres/Redis y volúmenes persistentes para datos. | US-SWFC-f4c2-003 | platform | infra/docker-compose.yml | S | P1 | TSK-SWFC-f4c2-008 | [x] |
| TSK-SWFC-f4c2-011 | Test | Smoke test de Compose | Script que levanta el stack, espera readiness y falla si un servicio no está sano. | US-SWFC-f4c2-003 | platform | scripts/smoke-compose.sh, tests/compose-smoke.test.ts | M | P1 | TSK-SWFC-f4c2-010 | [x] |
