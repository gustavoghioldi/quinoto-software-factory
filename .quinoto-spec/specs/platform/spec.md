# Spec: platform

## Current Requirements

### Requirement: Self-Hosted Compose Deployment
The system SHALL provide a Docker Compose deployment with web, api, worker, PostgreSQL, and Redis services and SHALL start healthy on a clean host.

#### Scenario: Clean install
- **GIVEN** a host with Docker and Docker Compose
- **WHEN** the operator runs the documented compose command
- **THEN** all services start and the instance is healthy within 30 minutes

#### Scenario: Missing required environment
- **GIVEN** a compose run without required variables
- **WHEN** the services start
- **THEN** startup fails fast with a message naming the missing variable

### Requirement: Database Migrations
The system SHALL apply versioned, reversible migrations automatically on startup and SHALL be idempotent across restarts.

#### Scenario: First start
- **GIVEN** an empty database
- **WHEN** the API starts
- **THEN** all migrations are applied and the schema version is recorded

#### Scenario: Repeated start
- **GIVEN** an up-to-date database
- **WHEN** the API restarts
- **THEN** no migration is reapplied and startup succeeds

### Requirement: Health and Readiness
The system SHALL expose `/healthz` for liveness and `/readyz` for dependency readiness.

#### Scenario: Dependencies ready
- **GIVEN** reachable PostgreSQL and Redis
- **WHEN** `/readyz` is called
- **THEN** it returns 200 with dependency status

#### Scenario: Dependency down
- **GIVEN** an unreachable Redis
- **WHEN** `/readyz` is called
- **THEN** it returns 503 and names the failing dependency

### Requirement: Environment Configuration
The system SHALL read all configuration from environment variables and SHALL validate them at startup with a typed schema.

#### Scenario: Invalid value
- **GIVEN** an invalid `MAX_SESSION_MINUTES`
- **WHEN** the service starts
- **THEN** startup fails with a validation error naming the variable

#### Scenario: Safe defaults
- **GIVEN** an optional variable not set
- **WHEN** the service starts
- **THEN** the documented safe default is applied

### Requirement: Upgrade Safety
The system SHALL support upgrading by image tag and SHALL document rollback to the previous tag.

#### Scenario: Upgrade
- **GIVEN** a running instance on version N
- **WHEN** the operator upgrades to N+1
- **THEN** migrations run, the instance becomes healthy, and data is preserved

#### Scenario: Failed upgrade
- **GIVEN** an upgrade that fails healthchecks
- **WHEN** the operator rolls back to version N
- **THEN** the previous image starts and the documented rollback steps restore service

### Requirement: Structured Observability
The system SHALL emit structured logs with correlation IDs and SHALL expose basic operational metrics.

#### Scenario: Trace a request
- **GIVEN** a user request that triggers a session
- **WHEN** the operator inspects logs
- **THEN** the request, job, and session share a correlation ID

#### Scenario: Error visibility
- **GIVEN** a failed stage
- **WHEN** the operator inspects logs and metrics
- **THEN** the failure is attributable to a component and an error code

### Requirement: Backup and Restore
The system SHALL document and support PostgreSQL backup and restore without stopping the instance for longer than necessary.

#### Scenario: Backup
- **GIVEN** a running instance
- **WHEN** the operator runs the documented backup command
- **THEN** a consistent dump is produced

#### Scenario: Restore
- **GIVEN** a backup file
- **WHEN** the operator restores it on a clean instance
- **THEN** projects, sessions, artifacts, and audit entries are recovered

---
