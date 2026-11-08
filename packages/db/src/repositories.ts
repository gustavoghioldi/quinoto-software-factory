import type { ApprovalRecord, ArtifactRecord, WorkflowRun } from "@factory/core";

export interface GitHubInstallationRecord {
  id: string;
  appId: string;
  slug: string;
  clientId: string | null;
  installationId: number | null;
  accountLogin: string | null;
  privateKeyCiphertext: string;
  webhookSecretCiphertext: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewGitHubInstallation {
  appId: string;
  slug: string;
  clientId: string | null;
  installationId: number | null;
  accountLogin: string | null;
  privateKeyCiphertext: string;
  webhookSecretCiphertext: string;
}

export interface ProjectRecord {
  id: string;
  name: string;
  repoFullName: string;
  defaultBranch: string;
  installationId: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewProject {
  name: string;
  repoFullName: string;
  defaultBranch: string;
  installationId: number;
}

export interface GitHubInstallationRepository {
  save(input: NewGitHubInstallation): Promise<GitHubInstallationRecord>;
  findLatest(): Promise<GitHubInstallationRecord | null>;
  updateInstallation(id: string, installationId: number, accountLogin: string): Promise<void>;
}

export interface ProjectRepository {
  create(input: NewProject): Promise<ProjectRecord>;
  list(): Promise<ProjectRecord[]>;
  findById(id: string): Promise<ProjectRecord | null>;
}

export interface WorkflowRepository {
  createRun(run: WorkflowRun): Promise<void>;
  findLatestByProject(projectId: string): Promise<WorkflowRun | null>;
  saveRun(run: WorkflowRun): Promise<void>;
}

export interface ArtifactRepository {
  create(artifact: ArtifactRecord): Promise<void>;
  listByProject(projectId: string): Promise<ArtifactRecord[]>;
}

export interface ApprovalRepository {
  create(approval: ApprovalRecord): Promise<void>;
  listByProject(projectId: string): Promise<ApprovalRecord[]>;
}
