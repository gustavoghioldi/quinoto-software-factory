import { randomUUID } from "node:crypto";
import type { ApprovalRecord, ArtifactRecord, WorkflowRun } from "@factory/core";
import type {
  ApprovalRepository,
  ArtifactRepository,
  GitHubInstallationRecord,
  GitHubInstallationRepository,
  NewGitHubInstallation,
  NewProject,
  NewRailwayLink,
  ProjectRecord,
  ProjectRepository,
  RailwayLinkRecord,
  RailwayLinkRepository,
  WorkflowRepository,
} from "./repositories.js";

export class InMemoryGitHubInstallationRepository implements GitHubInstallationRepository {
  private readonly records: GitHubInstallationRecord[] = [];

  async save(input: NewGitHubInstallation): Promise<GitHubInstallationRecord> {
    const now = new Date();
    const record: GitHubInstallationRecord = {
      ...input,
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    this.records.push(record);
    return record;
  }

  async findLatest(): Promise<GitHubInstallationRecord | null> {
    return this.records.at(-1) ?? null;
  }

  async updateInstallation(
    id: string,
    installationId: number,
    accountLogin: string,
  ): Promise<void> {
    const record = this.records.find((item) => item.id === id);
    if (!record) return;
    record.installationId = installationId;
    record.accountLogin = accountLogin;
    record.updatedAt = new Date();
  }
}

export class InMemoryProjectRepository implements ProjectRepository {
  private readonly records: ProjectRecord[] = [];

  async create(input: NewProject): Promise<ProjectRecord> {
    const now = new Date();
    const record: ProjectRecord = {
      ...input,
      id: randomUUID(),
      status: "ready",
      createdAt: now,
      updatedAt: now,
    };
    this.records.push(record);
    return record;
  }

  async list(): Promise<ProjectRecord[]> {
    return [...this.records];
  }

  async findById(id: string): Promise<ProjectRecord | null> {
    return this.records.find((item) => item.id === id) ?? null;
  }
}

export class InMemoryWorkflowRepository implements WorkflowRepository {
  private readonly runs: WorkflowRun[] = [];

  async createRun(run: WorkflowRun): Promise<void> {
    this.runs.push(structuredClone(run));
  }

  async findLatestByProject(projectId: string): Promise<WorkflowRun | null> {
    const latest = this.runs.filter((run) => run.projectId === projectId).at(-1);
    return latest ? structuredClone(latest) : null;
  }

  async saveRun(run: WorkflowRun): Promise<void> {
    const index = this.runs.findIndex((item) => item.id === run.id);
    if (index >= 0) {
      this.runs[index] = structuredClone(run);
    }
  }
}

export class InMemoryArtifactRepository implements ArtifactRepository {
  private readonly records: ArtifactRecord[] = [];

  async create(artifact: ArtifactRecord): Promise<void> {
    this.records.push(structuredClone(artifact));
  }

  async listByProject(projectId: string): Promise<ArtifactRecord[]> {
    return this.records.filter((artifact) => artifact.projectId === projectId);
  }
}

export class InMemoryApprovalRepository implements ApprovalRepository {
  private readonly records: ApprovalRecord[] = [];

  async create(approval: ApprovalRecord): Promise<void> {
    this.records.push(structuredClone(approval));
  }

  async listByProject(projectId: string): Promise<ApprovalRecord[]> {
    return this.records.filter((approval) => approval.projectId === projectId);
  }
}

export class InMemoryRailwayLinkRepository implements RailwayLinkRepository {
  private readonly links = new Map<string, RailwayLinkRecord>();

  async upsert(input: NewRailwayLink): Promise<RailwayLinkRecord> {
    const existing = this.links.get(input.projectId);
    const now = new Date();
    const record: RailwayLinkRecord = {
      ...input,
      id: existing?.id ?? randomUUID(),
      lastDeploymentId: existing?.lastDeploymentId ?? null,
      lastDeployStatus: existing?.lastDeployStatus ?? null,
      lastDeployUrl: existing?.lastDeployUrl ?? null,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };
    this.links.set(input.projectId, record);
    return record;
  }

  async findByProject(projectId: string): Promise<RailwayLinkRecord | null> {
    return this.links.get(projectId) ?? null;
  }

  async updateDeployment(
    projectId: string,
    deployment: { id: string; status: string; url: string | null },
  ): Promise<void> {
    const existing = this.links.get(projectId);
    if (!existing) {
      return;
    }
    existing.lastDeploymentId = deployment.id;
    existing.lastDeployStatus = deployment.status;
    existing.lastDeployUrl = deployment.url;
    existing.updatedAt = new Date();
  }
}
