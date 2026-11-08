# Spec: railway-adapter

## Current Requirements

### Requirement: Token Validation and Project Linking
The system SHALL validate the operator's Railway token and SHALL allow linking a factory project to a Railway project, service, and environment.

#### Scenario: Valid token
- **GIVEN** a valid Railway token
- **WHEN** the operator links a project
- **THEN** the available projects, services, and environments are listed

#### Scenario: Invalid token
- **GIVEN** an invalid or expired Railway token
- **WHEN** the operator attempts to link a project
- **THEN** the UI shows an actionable error and no partial link is stored

### Requirement: Ephemeral Runner Provisioning
The system SHALL create an ephemeral runner service from the pinned `factory-runner` image and SHALL wait for its healthcheck before starting a session.

#### Scenario: Successful provisioning
- **GIVEN** a valid Railway link
- **WHEN** a session starts
- **THEN** a runner service is created, becomes healthy, and its URL is returned to the worker

#### Scenario: Healthcheck timeout
- **GIVEN** a runner that does not become healthy within the timeout
- **WHEN** the deadline is reached
- **THEN** the service is destroyed and the session fails with `runner_unhealthy`

### Requirement: Deploy Trigger and Status
The system SHALL trigger a deploy for a linked project and SHALL expose building, success, and failed states with the resulting URL.

#### Scenario: Deploy succeeds
- **GIVEN** a linked project and a merged pull request
- **WHEN** the user triggers a deploy
- **THEN** the status transitions to `building` and then `success` with a URL

#### Scenario: Deploy fails
- **GIVEN** a deploy that fails
- **WHEN** the status is polled
- **THEN** the project shows `failed` with a link to the Railway logs

### Requirement: Log Retrieval
The system SHALL retrieve deploy and runner logs from Railway and SHALL redact secrets before showing them.

#### Scenario: Deploy logs
- **GIVEN** a failed deploy
- **WHEN** the user opens the deploy detail
- **THEN** the relevant logs are shown with secrets redacted

#### Scenario: Logs unavailable
- **GIVEN** a deploy whose logs have expired
- **WHEN** the user requests them
- **THEN** the UI explains the retention limit instead of failing silently

### Requirement: Cost Guardrails
The system SHALL track session duration and SHALL enforce a configurable per-project cost limit before provisioning new runners.

#### Scenario: Limit reached
- **GIVEN** a project that reached its configured limit
- **WHEN** a new session is requested
- **THEN** the request is blocked with a clear message and an audit entry

#### Scenario: Cancelled session cost
- **GIVEN** a session cancelled after a few minutes
- **WHEN** the cost is computed
- **THEN** only the consumed duration is counted

---
