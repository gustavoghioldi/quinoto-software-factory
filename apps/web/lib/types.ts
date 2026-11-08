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
