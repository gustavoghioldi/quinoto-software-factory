# Spec: web-ui

## Current Requirements

### Requirement: Project Dashboard
The system SHALL display a dashboard listing every project with its current workflow stage, active sessions, open pull requests, and last deploy status.

#### Scenario: Dashboard with multiple projects
- **GIVEN** two or more projects with different workflow states
- **WHEN** the user opens the dashboard
- **THEN** each project shows stage, active sessions, open PRs, and last deploy status

#### Scenario: Project requiring action
- **GIVEN** a project with a failed session or a pending approval
- **WHEN** the dashboard renders
- **THEN** the project is visually flagged as requiring action

### Requirement: GitHub Connection Wizard
The system SHALL provide a guided flow to authorize GitHub, select a repository, and choose a base branch.

#### Scenario: Successful connection
- **GIVEN** an instance without connected repositories
- **WHEN** the user completes the GitHub authorization and selects repo plus branch
- **THEN** a project is created and shown as `ready` in the dashboard

#### Scenario: Authorization failure
- **GIVEN** invalid or revoked GitHub credentials
- **WHEN** the user attempts to connect
- **THEN** the UI shows an actionable error and never renders the token

### Requirement: Workflow Stage Board
The system SHALL show each workflow stage as completed, active, blocked, or failed, including the reason when blocked.

#### Scenario: Blocked stage
- **GIVEN** a workflow waiting for human approval
- **WHEN** the user opens the project
- **THEN** the approval stage is shown as blocked with the required action

#### Scenario: Failed stage
- **GIVEN** a stage that failed
- **WHEN** the user opens the project
- **THEN** the stage shows `failed`, the error summary, and a retry control

### Requirement: Live Session Viewer
The system SHALL stream agent session events to the browser with a latency of at most 3 seconds and SHALL allow cancelling an active session.

#### Scenario: Live events
- **GIVEN** an active agent session
- **WHEN** the runner emits events
- **THEN** the viewer shows messages and tool calls within 3 seconds

#### Scenario: Cancel session
- **GIVEN** an active session
- **WHEN** the user presses cancel and confirms
- **THEN** the UI shows the session as `cancelled` and stops receiving events

### Requirement: Diff Review and PR Confirmation
The system SHALL present the changes produced by a session and require explicit confirmation before opening a pull request.

#### Scenario: Confirm delivery
- **GIVEN** a completed session with file changes
- **WHEN** the user reviews the diff and confirms
- **THEN** the UI shows the created PR URL and links the session and artifacts

#### Scenario: Reject delivery
- **GIVEN** a completed session with file changes
- **WHEN** the user rejects the diff with feedback
- **THEN** no PR is created and the feedback is queued for a retry

### Requirement: Approval Inbox
The system SHALL list pending human approvals and record the decision with actor, timestamp, and scope.

#### Scenario: Approve artifact
- **GIVEN** an artifact pending approval
- **WHEN** an authorized user approves it
- **THEN** the approval is recorded and the workflow unblocks

#### Scenario: Unauthorized approval attempt
- **GIVEN** a user without approval permission
- **WHEN** the user attempts to approve
- **THEN** the action is rejected and audited

### Requirement: UI State Coverage
The system SHALL define empty, loading, error, and success states for every data-driven view.

#### Scenario: Empty dashboard
- **GIVEN** an instance without projects
- **WHEN** the user opens the dashboard
- **THEN** an empty state explains how to connect the first repository

#### Scenario: API unavailable
- **GIVEN** the API is unreachable
- **WHEN** a view requests data
- **THEN** the UI shows a retryable error without losing navigation

---
