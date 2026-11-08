# Spec: security

## Current Requirements

### Requirement: Secret Encryption at Rest
The system SHALL encrypt every GitHub token, Railway token, and model API key with AES-256-GCM before persisting it and SHALL never store plaintext secrets.

#### Scenario: Persist a token
- **GIVEN** a new integration token
- **WHEN** the system stores it
- **THEN** only ciphertext and a nonce are persisted

#### Scenario: Read a token
- **GIVEN** a stored ciphertext
- **WHEN** an authorized internal component needs the token
- **THEN** it is decrypted in memory and never returned through the public API

### Requirement: Secret Redaction
The system SHALL redact known secret patterns from logs, events, error messages, and audit details before persistence and before streaming.

#### Scenario: Token in agent output
- **GIVEN** an agent output containing a token
- **WHEN** the event is processed
- **THEN** the token is replaced with a redaction marker in every sink

#### Scenario: Secret in stack trace
- **GIVEN** an exception whose message contains a connection string
- **WHEN** the error is logged
- **THEN** the credential portion is redacted

### Requirement: Session Isolation
The system SHALL run each agent session in its own container with a non-root user, no host mounts, and no access to other projects' data.

#### Scenario: Cross-project access attempt
- **GIVEN** a runner for project A
- **WHEN** the agent attempts to read project B data
- **THEN** access is denied and the attempt is audited

#### Scenario: Container cleanup
- **GIVEN** a session that ended
- **WHEN** the runner is destroyed
- **THEN** no container, volume, or credential remains active

### Requirement: Append-only Audit Log
The system SHALL record sensitive actions in an append-only audit log containing actor, action, subject, timestamp, and redacted detail.

#### Scenario: Record an action
- **GIVEN** a sensitive action such as approval, delivery, or secret change
- **WHEN** it completes
- **THEN** an immutable audit entry is written

#### Scenario: Attempt to modify audit
- **GIVEN** an existing audit entry
- **WHEN** the application attempts to update or delete it
- **THEN** the operation is rejected

### Requirement: Least Privilege
The system SHALL request only the GitHub and Railway scopes required for its documented operations.

#### Scenario: GitHub permissions
- **GIVEN** the GitHub App installation
- **WHEN** the operator reviews permissions
- **THEN** only contents, pull requests, and metadata are requested

#### Scenario: Railway token scope
- **GIVEN** a Railway token
- **WHEN** the operator links a project
- **THEN** the documentation recommends a project-scoped token when available

### Requirement: Telemetry Opt-in
The system SHALL send no telemetry by default and SHALL require explicit operator consent to enable it.

#### Scenario: Default installation
- **GIVEN** a fresh self-hosted instance
- **WHEN** it starts without configuration
- **THEN** no outbound telemetry is sent

#### Scenario: Opt-in
- **GIVEN** an operator that enables telemetry
- **WHEN** the instance runs
- **THEN** only the documented anonymous metrics are sent

### Requirement: Master Key Rotation
The system SHALL document and support rotating `FACTORY_MASTER_KEY` without losing access to stored integrations.

#### Scenario: Rotate key
- **GIVEN** an existing master key and stored secrets
- **WHEN** the operator runs the rotation procedure
- **THEN** secrets are re-encrypted with the new key and old ciphertext is removed

#### Scenario: Lost key
- **GIVEN** a lost master key
- **WHEN** the operator attempts to use stored integrations
- **THEN** the system reports that reconnection is required instead of failing silently

---
