export interface Project {
  id: string;
  name: string;
  repoFullName: string;
  defaultBranch: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Repository {
  id: number;
  fullName: string;
  defaultBranch: string;
  private: boolean;
}

export interface WorkflowStage {
  stage: string;
  status: string;
  attempts: number;
  startedAt: string | null;
  finishedAt: string | null;
  error: string | null;
}

export interface Workflow {
  id: string;
  projectId: string;
  currentStage: string;
  status: string;
  stages: WorkflowStage[];
}

export interface Approval {
  id: string;
  projectId: string;
  subject: string;
  decision: string;
  decidedBy: string;
  decidedAt: string;
  scope: string;
  rationale: string;
}

export interface AgentSession {
  id: string;
  projectId: string;
  stage: string;
  prompt: string;
  status: string;
  runnerServiceId: string | null;
  startedAt: string;
  endedAt: string | null;
  maxMinutes: number;
}

export interface SessionEvent {
  id: number;
  sessionId: string;
  type: string;
  payload: unknown;
  createdAt: string;
}

export interface DiffFile {
  path: string;
  patch: string;
}

export interface SessionDiff {
  files: DiffFile[];
}

export interface PullRequestResult {
  number: number;
  url: string;
}

export interface ProjectOverview {
  id: string;
  name: string;
  repoFullName: string;
  defaultBranch: string;
  status: string;
  workflow: { currentStage: string; status: string } | null;
  activeSessions: number;
  pullRequests: Array<{ number: number; url: string }>;
  deploy: { status: string | null; url: string | null } | null;
}

export interface RailwayLink {
  id: string;
  projectId: string;
  railwayProjectId: string;
  serviceId: string;
  environmentId: string;
  lastDeploymentId: string | null;
  lastDeployStatus: string | null;
  lastDeployUrl: string | null;
}

export interface Deployment {
  id: string;
  status: string;
  url: string | null;
}
