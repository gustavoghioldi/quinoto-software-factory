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

export interface RailwayLinkRecord {
  id: string;
  projectId: string;
  railwayProjectId: string;
  serviceId: string;
  environmentId: string;
  lastDeploymentId: string | null;
  lastDeployStatus: string | null;
  lastDeployUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewRailwayLink {
  projectId: string;
  railwayProjectId: string;
  serviceId: string;
  environmentId: string;
}

export interface RailwayLinkRepository {
  upsert(input: NewRailwayLink): Promise<RailwayLinkRecord>;
  findByProject(projectId: string): Promise<RailwayLinkRecord | null>;
  updateDeployment(
    projectId: string,
    deployment: { id: string; status: string; url: string | null },
  ): Promise<void>;
}

export interface AuditEntry {
  id: number;
  projectId: string | null;
  actor: string;
  action: string;
  subject: string;
  detail: unknown;
  createdAt: string;
}

export interface NewAuditEntry {
  projectId: string | null;
  actor: string;
  action: string;
  subject: string;
  detail?: unknown;
}

export interface AuditRepository {
  append(entry: NewAuditEntry): Promise<AuditEntry>;
  listByProject(projectId: string): Promise<AuditEntry[]>;
}
