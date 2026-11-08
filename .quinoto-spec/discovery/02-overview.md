# Overview

Guardar en: `.quinoto-spec/discovery/02-overview.md`

## Resumen ejecutivo

**Quinoto Software Factory** es una app web self-hosted que orquesta el ciclo de vida de un
proyecto de software usando OpenCode como motor de agentes y QuinotoSpec como sistema de
artefactos y reglas. La v1 conecta GitHub (repositorios y Pull Requests) y Railway
(ejecución de agentes y deploy de la aplicación resultante).

Estado del repositorio: **greenfield**. No hay código, stack ni pipeline definidos todavía.
El contexto de producto vive en `08-product-and-agreements.md` y el alcance funcional en
`.quinoto-spec/prd/quinoto-software-factory/prd.md` (PRD-0001).

## Alcance de este discovery

| Archivo | Estado | Motivo |
|---------|--------|--------|
| 01-stack-profile.md | Pendiente | Sin código; el stack se decide en la propuesta técnica derivada de PRD-0001. |
| 02-overview.md | Parcial | Este archivo. |
| 03-architecture.md | Pendiente | Depende de la propuesta técnica. |
| 04-endpoints-and-openapi.md | Pendiente | Depende de la propuesta técnica. |
| 05-data-and-services.md | Pendiente | Depende de la propuesta técnica. |
| 06-devops-ci-security.md | Pendiente | Depende de la propuesta técnica. |
| 07-findings-and-recommendations.md | Pendiente | Sin código que auditar. |
| 08-product-and-agreements.md | Completo | Contexto de producto y acuerdos iniciales. |

## Próximo paso

Ejecutar `@quinotospec.create-proposal` a partir de PRD-0001 para decidir stack, arquitectura y
plan de implementación. Después del primer scaffold, re-ejecutar `@quinotospec.discovery`
para completar los archivos técnicos.
