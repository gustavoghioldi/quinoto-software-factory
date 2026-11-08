---
name: Delta Spec — github-adapter
description: Requerimientos nuevos de la integración con GitHub
---

# Delta Spec: github-adapter — quinoto-software-factory-mvp

**Contract Version:** 1
**Proposal ID:** 2026-11-08-quinoto-software-factory-mvp
**Propuesta:** Quinoto Software Factory MVP
**Prefijo:** SWFC-f4c2
**Fecha de Creación:** 2026-11-08
**Estado:** proposed

---

## ADDED Requirements

### Requirement: GitHub App Authentication
The system SHALL authenticate against GitHub using a GitHub App created through the manifest flow and SHALL use short-lived installation tokens for repository operations.

#### Scenario: Install the app
- **GIVEN** an operator on a self-hosted instance
- **WHEN** the operator completes the GitHub App manifest flow
- **THEN** the instance stores the app ID, private key, and webhook secret encrypted

#### Scenario: Installation token expiry
- **GIVEN** an expired installation token
- **WHEN** the adapter needs to call GitHub
- **THEN** it requests a new token transparently and retries the operation once

### Requirement: Repository Discovery
The system SHALL list the repositories available to the installation with name, default branch, visibility, and permissions.

#### Scenario: List repositories
- **GIVEN** a valid installation
- **WHEN** the user opens the repository selector
- **THEN** the available repositories are listed with their default branches

#### Scenario: Repository without required permissions
- **GIVEN** a repository where the app lacks contents or pull request permissions
- **WHEN** the user selects it
- **THEN** the UI explains the missing permission and blocks project creation

### Requirement: Branch and Commit Management
The system SHALL create a working branch per delivery and SHALL commit changes only to that branch.

#### Scenario: Create branch
- **GIVEN** a ready project and a completed session
- **WHEN** the adapter prepares the delivery
- **THEN** a branch named after the proposal prefix and stage is created from the base branch

#### Scenario: Protected main branch
- **GIVEN** a repository with a protected default branch
- **WHEN** the adapter attempts any write
- **THEN** it never targets the default branch and reports a typed error if the branch cannot be created

### Requirement: Pull Request Creation
The system SHALL open a pull request with title, summary, artifact links, session link, and a checklist.

#### Scenario: Open pull request
- **GIVEN** a branch with committed changes
- **WHEN** the user confirms delivery
- **THEN** a pull request is opened and its number and URL are persisted

#### Scenario: Duplicate delivery
- **GIVEN** a session whose branch already has an open pull request
- **WHEN** delivery is requested again
- **THEN** the existing pull request is updated instead of creating a duplicate

### Requirement: Rate Limit and Retry
The system SHALL handle GitHub rate limits with exponential backoff and SHALL make write operations idempotent.

#### Scenario: Secondary rate limit
- **GIVEN** a GitHub secondary rate limit response
- **WHEN** the adapter retries
- **THEN** it backs off, respects `Retry-After`, and surfaces a typed error after the retry budget

#### Scenario: Retried commit
- **GIVEN** a commit request that timed out after succeeding
- **WHEN** the adapter retries
- **THEN** no duplicate commit is created

### Requirement: Webhook Verification
The system SHALL verify the signature of every GitHub webhook before processing it.

#### Scenario: Valid signature
- **GIVEN** a webhook with a valid signature
- **WHEN** it is received
- **THEN** the event is processed and acknowledged

#### Scenario: Invalid signature
- **GIVEN** a webhook with an invalid signature
- **WHEN** it is received
- **THEN** it is rejected with 401 and audited without processing

---

## MODIFIED Requirements

_Ninguno: no existe un spec previo para este dominio._

## REMOVED Requirements

_Ninguno._

## RENAMED Requirements

_Ninguno._
