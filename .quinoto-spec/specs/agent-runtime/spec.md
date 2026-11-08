# Spec: agent-runtime

## Current Requirements

### Requirement: Ephemeral Session Container
The system SHALL provision exactly one isolated container per agent session and SHALL destroy it when the session ends, fails, or times out.

#### Scenario: Session completes
- **GIVEN** a session that finishes successfully
- **WHEN** the session is marked `done`
- **THEN** the runner container is destroyed and its service ID is recorded as terminated

#### Scenario: Provisioning failure
- **GIVEN** Railway rejects the service creation
- **WHEN** the worker attempts provisioning
- **THEN** the session fails with `runner_provision_failed` and no orphan service remains

### Requirement: OpenCode Session Bridge
The system SHALL drive the agent through the OpenCode server/SDK using a pinned protocol version and SHALL NOT parse terminal output.

#### Scenario: Start session
- **GIVEN** a healthy runner
- **WHEN** the worker opens an OpenCode session
- **THEN** the session starts with the stage prompt and repository context

#### Scenario: Protocol mismatch
- **GIVEN** a runner with an unsupported OpenCode protocol version
- **WHEN** the worker attempts to connect
- **THEN** the session fails with an explicit version error

### Requirement: Live Event Stream
The system SHALL stream session events to the API with a maximum latency of 3 seconds and SHALL persist them for later inspection.

#### Scenario: Event delivery
- **GIVEN** an active session
- **WHEN** the runner emits a message or tool call
- **THEN** the event is persisted and forwarded to the API within 3 seconds

#### Scenario: Stream reconnection
- **GIVEN** a client that lost its SSE connection
- **WHEN** it reconnects with `Last-Event-ID`
- **THEN** it receives the events emitted after that identifier

### Requirement: Session Cancellation and Timeout
The system SHALL support explicit cancellation and SHALL enforce a configurable maximum duration per session.

#### Scenario: User cancels
- **GIVEN** an active session
- **WHEN** the user cancels it
- **THEN** the agent stops, the container is destroyed, and the session is marked `cancelled`

#### Scenario: Timeout
- **GIVEN** a session exceeding `MAX_SESSION_MINUTES`
- **WHEN** the limit is reached
- **THEN** the session is cancelled, marked `timed_out`, and the partial log is preserved

### Requirement: Log Persistence and Redaction
The system SHALL persist session logs with secrets redacted before storage and before streaming.

#### Scenario: Secret in output
- **GIVEN** a tool call that prints a token
- **WHEN** the event is processed
- **THEN** the token is replaced with a redaction marker in storage and in the UI

#### Scenario: Log retention
- **GIVEN** a session ended 30 days ago
- **WHEN** the user opens its detail
- **THEN** the redacted log is still available according to the retention policy

### Requirement: Orphan Reconciliation
The system SHALL periodically reconcile active runner services against sessions and SHALL terminate services without a live session.

#### Scenario: Orphan detected
- **GIVEN** a runner service with no matching active session
- **WHEN** the reconciliation job runs
- **THEN** the service is terminated and an audit entry is created

### Requirement: Resource Limits and Concurrency
The system SHALL enforce configurable concurrency limits and resource limits per runner.

#### Scenario: Concurrency limit
- **GIVEN** the maximum concurrent sessions is reached
- **WHEN** a new session is requested
- **THEN** it is queued and the user sees its queue position

---
