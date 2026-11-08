# Guía para Agentes QuinotoSpec — quinoto-software-factory

> **Proyecto:** quinoto-software-factory
> **Stack:** TypeScript monorepo (pnpm + Turborepo)
> **Lenguaje:** TypeScript
> **Tech stack:** Next.js 15, React 19, Fastify 5, PostgreSQL 16, Redis 7, Docker Compose
> **Convenciones:** Proposal First, Context Slicing, TDD, Verify Before Done
> **Testing:** Vitest (unit/integration), Playwright (e2e, F4)
> **Reglas:** standard
> **Generado desde:** `.quinoto-spec/config.yaml`

## Workflows activos

- `@quinotospec.constitution`
- `@quinotospec.discovery`
- `@quinotospec.create-prd`
- `@quinotospec.proposal`
- `@quinotospec.user-stories`
- `@quinotospec.tasks`
- `@quinotospec.apply`
- `@quinotospec.review`
- `@quinotospec.review-handoff`
- `@quinotospec.archive`

## Workflows opcionales

- `@quinotospec.battle-frenzy`
- `@quinotospec.heimdallr`
- `@quinotospec.mjolnir-refactor`

## Skills activas

- `/quinotospec-agent-config`
- `/quinotospec-agent-train`
- `/quinotospec-apply`
- `/quinotospec-archive`
- `/quinotospec-artifact-engine`
- `/quinotospec-backup`
- `/quinotospec-battle-frenzy`
- `/quinotospec-bifrost`
- `/quinotospec-blood-bond`
- `/quinotospec-blood-bond-analyzer`
- `/quinotospec-blood-bond-monitor`
- `/quinotospec-blood-bond-predictor`
- `/quinotospec-changelog-view`
- `/quinotospec-cleanup`
- `/quinotospec-complexity-router`
- `/quinotospec-conflict-detector`
- `/quinotospec-constitution`
- `/quinotospec-contract`
- `/quinotospec-create-prd`
- `/quinotospec-create-proposal`
- `/quinotospec-create-rfc`
- `/quinotospec-create-tasks`
- `/quinotospec-create-user-stories`
- `/quinotospec-debug`
- `/quinotospec-dependency-graph`
- `/quinotospec-diff`
- `/quinotospec-discovery`
- `/quinotospec-distribute`
- `/quinotospec-entropy-calculator`
- `/quinotospec-estimate`
- `/quinotospec-export`
- `/quinotospec-extension-install`
- `/quinotospec-extension-manager`
- `/quinotospec-file-creation`
- `/quinotospec-fix`
- `/quinotospec-flow`
- `/quinotospec-generate-github-branch`
- `/quinotospec-health`
- `/quinotospec-heimdallr`
- `/quinotospec-help`
- `/quinotospec-huginn-muninn`
- `/quinotospec-import`
- `/quinotospec-init`
- `/quinotospec-jormungandr`
- `/quinotospec-mark-done`
- `/quinotospec-metrics`
- `/quinotospec-migrate`
- `/quinotospec-mimir`
- `/quinotospec-mjolnir-refactor`
- `/quinotospec-norns`
- `/quinotospec-onboard`
- `/quinotospec-onboard-developer`
- `/quinotospec-onboard-general`
- `/quinotospec-onboard-product`
- `/quinotospec-onboard-simple`
- `/quinotospec-onboard-support`
- `/quinotospec-party-mode`
- `/quinotospec-party-orchestrator`
- `/quinotospec-pre-commit`
- `/quinotospec-preset-install`
- `/quinotospec-quick-dev`
- `/quinotospec-receive-review`
- `/quinotospec-refresh-discovery`
- `/quinotospec-release`
- `/quinotospec-retrospective`
- `/quinotospec-review`
- `/quinotospec-review-handoff`
- `/quinotospec-rollback`
- `/quinotospec-rules-enforce`
- `/quinotospec-schema-fork`
- `/quinotospec-search`
- `/quinotospec-skald`
- `/quinotospec-specs-init`
- `/quinotospec-sprint-create`
- `/quinotospec-sprint-plan`
- `/quinotospec-sprints-init`
- `/quinotospec-stack-detect`
- `/quinotospec-stack-discovery`
- `/quinotospec-stats`
- `/quinotospec-status`
- `/quinotospec-suggest-next`
- `/quinotospec-swarm-executor`
- `/quinotospec-swarm-task-splitter`
- `/quinotospec-sync`
- `/quinotospec-syntax-validate`
- `/quinotospec-tdd`
- `/quinotospec-template-resolver`
- `/quinotospec-tiwaz-rune`
- `/quinotospec-ui`
- `/quinotospec-update-agents`
- `/quinotospec-update-changelog`
- `/quinotospec-validate`
- `/quinotospec-valkyrie`
- `/quinotospec-verify-before-done`
- `/quinotospec-worktree`

## Reglas

- `Gestión del Changelog`
- `Gestión de Prefijos e IDs`
- `Product Agreement Check (BLOQUEANTE)`
- `No Sobreescribir Archivos de Especificación`
- `Validación de Estado Antes de Archivar`
- `Convención de Archivado`
- `Convención de Nombrado de Branches`
- `Aprobación de Configuración Crítica`
- `Validación Pre-Workflow Crítico (BLOQUEANTE)`
- `Backup Pre-Refactor (BLOQUEANTE)`
- `Validación de Sintaxis Pre-Apply`
- `Protección de Archivos Archivados (BLOQUEANTE)`
- `Blood-Bond Monitor (Global)`
- `TDD Enforcement (STANDARD)`
- `Debugging Sistematico (STANDARD)`
- `Verificacion Antes de Completar (BLOQUEANTE)`
- `Constitutional Compliance (BLOQUEANTE)`
- `Aprobación Humana Estructurada (BLOQUEANTE)`

## Extensiones

- Ninguno configurado

## Contexto del proyecto

- Proposal First: crear contexto y propuesta antes de modificar código.
- Context Slicing: seleccionar solo el contexto relevante.
- TDD: registrar RED antes de producción.
- Verify Before Done: exigir evidencia fresca antes de completar.
- Changelog: registrar cambios mediante `quinotospec-update-changelog`.

## Comandos de referencia

- `@quinotospec.discovery`
- `@quinotospec.create-proposal`
- `@quinotospec.create-user-stories`
- `@quinotospec.create-tasks`
- `@quinotospec.apply`
- `@quinotospec.review`
- `@quinotospec.archive`
- `@quinotospec.update-agents`

<!-- GENERATED: do not edit manually; update .quinoto-spec/config.yaml and regenerate -->
