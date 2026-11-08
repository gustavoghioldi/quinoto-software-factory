import { randomUUID } from "node:crypto";
import type {
  GitHubInstallationRecord,
  GitHubInstallationRepository,
  NewGitHubInstallation,
  NewProject,
  ProjectRecord,
  ProjectRepository,
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
