---
name: Delta Spec — orchestrator
description: Requerimientos nuevos del orquestador del workflow QuinotoSpec
---

# Delta Spec: orchestrator — quinoto-software-factory-mvp

**Contract Version:** 1
**Proposal ID:** 2026-11-08-quinoto-software-factory-mvp
**Propuesta:** Quinoto Software Factory MVP
**Prefijo:** SWFC-f4c2
**Fecha de Creación:** 2026-11-08
**Estado:** proposed

---

## ADDED Requirements

### Requirement: Workflow State Machine
The system SHALL model the QuinotoSpec workflow as an explicit state machine with the stages `discovery`, `proposal`, `approval_proposal`, `user_stories`, `tasks`, `apply`, `review_diff`, and `pull_request`.

#### Scenario: Happy path
- **GIVEN** a project with a valid repository
- **WHEN** the workflow starts
- **THEN** stages advance in order and each stage records start and end timestamps

#### Scenario: Invalid transition
- **GIVEN** a stage that is not `done`
- **WHEN** a transition to a later stage is requested
- **THEN** the transition is rejected with a typed error and the state is unchanged

### Requirement: Stage Gate Enforcement
The system SHALL block a stage transition until its required artifacts exist and its human approvals are recorded.

#### Scenario: Missing approval
- **GIVEN** the proposal stage completed without an approval
- **WHEN** the workflow attempts to start user stories
- **THEN** the transition is blocked and the UI reports the missing approval

#### Scenario: Missing artifact
- **GIVEN** the tasks stage has no task file
- **WHEN** the workflow attempts to start apply
- **THEN** the transition is blocked and the missing artifact is named

### Requirement: Artifact Tracking
The system SHALL persist a record for every QuinotoSpec artifact produced, including kind, path, checksum, producing session, and creation time.

#### Scenario: Artifact produced
- **GIVEN** an agent session that writes a proposal file
- **WHEN** the session completes
- **THEN** an artifact record is stored and linked to the project and session

#### Scenario: Artifact checksum mismatch
- **GIVEN** an artifact record with a stored checksum
- **WHEN** the file content no longer matches
- **THEN** the system flags the artifact as modified and records an audit entry

### Requirement: Retry from Checkpoint
The system SHALL allow retrying a failed stage without discarding artifacts from prior completed stages.

#### Scenario: Retry failed stage
- **GIVEN** a workflow failed at `tasks` with prior stages completed
- **WHEN** the user retries
- **THEN** the workflow resumes at `tasks` and prior artifacts remain unchanged

#### Scenario: Retry history
- **GIVEN** a stage retried at least once
- **WHEN** the user inspects the timeline
- **THEN** each attempt appears as a separate entry with its outcome

### Requirement: Project Session Serialization
The system SHALL allow at most one active agent session per project and SHALL reject concurrent sessions with a typed conflict error.

#### Scenario: Concurrent start
- **GIVEN** a project with an active session
- **WHEN** another session start is requested
- **THEN** the request is rejected with `session_already_active`

#### Scenario: Stale lock recovery
- **GIVEN** a lock whose session ended without releasing it
- **WHEN** the lock TTL expires
- **THEN** the next session can start and the stale lock is audited

### Requirement: Workflow Event Publication
The system SHALL publish a normalized event for every state transition and stage outcome.

#### Scenario: Stage transition event
- **GIVEN** a stage transition
- **WHEN** the transition commits
- **THEN** an event with project, run, stage, and outcome is published to the API layer

---

## MODIFIED Requirements

_Ninguno: no existe un spec previo para este dominio._

## REMOVED Requirements

_Ninguno._

## RENAMED Requirements

_Ninguno._
