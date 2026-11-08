import { desc, eq } from "drizzle-orm";
import type { Database } from "./client.js";
import type {
  GitHubInstallationRecord,
  GitHubInstallationRepository,
  NewGitHubInstallation,
  NewProject,
  ProjectRecord,
  ProjectRepository,
} from "./repositories.js";
import { githubInstallations, projects } from "./schema.js";

export class PostgresGitHubInstallationRepository implements GitHubInstallationRepository {
  constructor(private readonly db: Database) {}

  async save(input: NewGitHubInstallation): Promise<GitHubInstallationRecord> {
    const [row] = await this.db.insert(githubInstallations).values(input).returning();
    if (!row) {
      throw new Error("failed to save GitHub installation");
    }
    return row;
  }

  async findLatest(): Promise<GitHubInstallationRecord | null> {
    const rows = await this.db
      .select()
      .from(githubInstallations)
      .orderBy(desc(githubInstallations.createdAt))
      .limit(1);
    return rows[0] ?? null;
  }

  async updateInstallation(
    id: string,
    installationId: number,
    accountLogin: string,
  ): Promise<void> {
    await this.db
      .update(githubInstallations)
      .set({ installationId, accountLogin, updatedAt: new Date() })
      .where(eq(githubInstallations.id, id));
  }
}

export class PostgresProjectRepository implements ProjectRepository {
  constructor(private readonly db: Database) {}

  async create(input: NewProject): Promise<ProjectRecord> {
    const [row] = await this.db.insert(projects).values(input).returning();
    if (!row) {
      throw new Error("failed to create project");
    }
    return row;
  }

  async list(): Promise<ProjectRecord[]> {
    return this.db.select().from(projects).orderBy(desc(projects.createdAt));
  }

  async findById(id: string): Promise<ProjectRecord | null> {
    const rows = await this.db.select().from(projects).where(eq(projects.id, id)).limit(1);
    return rows[0] ?? null;
  }
}
