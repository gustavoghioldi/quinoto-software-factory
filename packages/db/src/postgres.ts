import { and, desc, eq } from "drizzle-orm";
import type {
  ApprovalRecord,
  ArtifactRecord,
  RunStatus,
  Stage,
  StageStatus,
  WorkflowRun,
} from "@factory/core";
import type { Database } from "./client.js";
import type {
  ApprovalRepository,
  ArtifactRepository,
  AuditEntry,
  AuditRepository,
  GitHubInstallationRecord,
  GitHubInstallationRepository,
  NewAuditEntry,
  NewGitHubInstallation,
  NewProject,
  NewRailwayLink,
  ProjectRecord,
  ProjectRepository,
  RailwayLinkRecord,
  RailwayLinkRepository,
  WorkflowRepository,
} from "./repositories.js";
import {
  approvals,
  artifacts,
  auditEntries,
  githubInstallations,
  projects,
  railwayLinks,
  workflowRuns,
  workflowStages,
} from "./schema.js";

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

export class PostgresWorkflowRepository implements WorkflowRepository {
  constructor(private readonly db: Database) {}

  async createRun(run: WorkflowRun): Promise<void> {
    await this.db.transaction(async (tx) => {
      await tx.insert(workflowRuns).values({
        id: run.id,
        projectId: run.projectId,
        currentStage: run.currentStage,
        status: run.status,
      });
      await tx.insert(workflowStages).values(
        run.stages.map((stage) => ({
          runId: run.id,
          stage: stage.stage,
          status: stage.status,
          attempts: stage.attempts,
          startedAt: stage.startedAt ? new Date(stage.startedAt) : null,
          finishedAt: stage.finishedAt ? new Date(stage.finishedAt) : null,
          error: stage.error,
        })),
      );
    });
  }

  async findLatestByProject(projectId: string): Promise<WorkflowRun | null> {
    const rows = await this.db
      .select()
      .from(workflowRuns)
      .where(eq(workflowRuns.projectId, projectId))
      .orderBy(desc(workflowRuns.createdAt))
      .limit(1);
    const run = rows[0];
    if (!run) {
      return null;
    }
    const stages = await this.db
      .select()
      .from(workflowStages)
      .where(eq(workflowStages.runId, run.id));
    return {
      id: run.id,
      projectId: run.projectId,
      currentStage: run.currentStage as Stage,
      status: run.status as RunStatus,
      stages: stages.map((stage) => ({
        stage: stage.stage as Stage,
        status: stage.status as StageStatus,
        attempts: stage.attempts,
        startedAt: stage.startedAt?.toISOString() ?? null,
        finishedAt: stage.finishedAt?.toISOString() ?? null,
        error: stage.error,
      })),
    };
  }

  async saveRun(run: WorkflowRun): Promise<void> {
    await this.db.transaction(async (tx) => {
      await tx
        .update(workflowRuns)
        .set({ currentStage: run.currentStage, status: run.status, updatedAt: new Date() })
        .where(eq(workflowRuns.id, run.id));
      for (const stage of run.stages) {
        await tx
          .update(workflowStages)
          .set({
            status: stage.status,
            attempts: stage.attempts,
            startedAt: stage.startedAt ? new Date(stage.startedAt) : null,
            finishedAt: stage.finishedAt ? new Date(stage.finishedAt) : null,
            error: stage.error,
          })
          .where(and(eq(workflowStages.runId, run.id), eq(workflowStages.stage, stage.stage)));
      }
    });
  }
}

export class PostgresArtifactRepository implements ArtifactRepository {
  constructor(private readonly db: Database) {}

  async create(artifact: ArtifactRecord): Promise<void> {
    await this.db.insert(artifacts).values({
      id: artifact.id,
      projectId: artifact.projectId,
      kind: artifact.kind,
      path: artifact.path,
      checksum: artifact.checksum,
      createdAt: new Date(artifact.createdAt),
    });
  }

  async listByProject(projectId: string): Promise<ArtifactRecord[]> {
    const rows = await this.db
      .select()
      .from(artifacts)
      .where(eq(artifacts.projectId, projectId))
      .orderBy(desc(artifacts.createdAt));
    return rows.map((row) => ({
      id: row.id,
      projectId: row.projectId,
      kind: row.kind as ArtifactRecord["kind"],
      path: row.path,
      checksum: row.checksum,
      createdAt: row.createdAt.toISOString(),
    }));
  }
}

export class PostgresApprovalRepository implements ApprovalRepository {
  constructor(private readonly db: Database) {}

  async create(approval: ApprovalRecord): Promise<void> {
    await this.db.insert(approvals).values({
      id: approval.id,
      projectId: approval.projectId,
      subject: approval.subject,
      decision: approval.decision,
      decidedBy: approval.decidedBy,
      decidedAt: new Date(approval.decidedAt),
      scope: approval.scope,
      rationale: approval.rationale,
    });
  }

  async listByProject(projectId: string): Promise<ApprovalRecord[]> {
    const rows = await this.db
      .select()
      .from(approvals)
      .where(eq(approvals.projectId, projectId))
      .orderBy(desc(approvals.decidedAt));
    return rows.map((row) => ({
      id: row.id,
      projectId: row.projectId,
      subject: row.subject,
      decision: row.decision as ApprovalRecord["decision"],
      decidedBy: row.decidedBy,
      decidedAt: row.decidedAt.toISOString(),
      scope: row.scope,
      rationale: row.rationale,
    }));
  }
}

export class PostgresRailwayLinkRepository implements RailwayLinkRepository {
  constructor(private readonly db: Database) {}

  async upsert(input: NewRailwayLink): Promise<RailwayLinkRecord> {
    const [row] = await this.db
      .insert(railwayLinks)
      .values(input)
      .onConflictDoUpdate({
        target: railwayLinks.projectId,
        set: {
          railwayProjectId: input.railwayProjectId,
          serviceId: input.serviceId,
          environmentId: input.environmentId,
          updatedAt: new Date(),
        },
      })
      .returning();
    if (!row) {
      throw new Error("failed to upsert railway link");
    }
    return row;
  }

  async findByProject(projectId: string): Promise<RailwayLinkRecord | null> {
    const rows = await this.db
      .select()
      .from(railwayLinks)
      .where(eq(railwayLinks.projectId, projectId))
      .limit(1);
    return rows[0] ?? null;
  }

  async updateDeployment(
    projectId: string,
    deployment: { id: string; status: string; url: string | null },
  ): Promise<void> {
    await this.db
      .update(railwayLinks)
      .set({
        lastDeploymentId: deployment.id,
        lastDeployStatus: deployment.status,
        lastDeployUrl: deployment.url,
        updatedAt: new Date(),
      })
      .where(eq(railwayLinks.projectId, projectId));
  }
}

export class PostgresAuditRepository implements AuditRepository {
  constructor(private readonly db: Database) {}

  async append(entry: NewAuditEntry): Promise<AuditEntry> {
    const [row] = await this.db
      .insert(auditEntries)
      .values({
        projectId: entry.projectId,
        actor: entry.actor,
        action: entry.action,
        subject: entry.subject,
        detail: entry.detail ?? null,
      })
      .returning();
    if (!row) {
      throw new Error("failed to append audit entry");
    }
    return {
      id: row.id,
      projectId: row.projectId,
      actor: row.actor,
      action: row.action,
      subject: row.subject,
      detail: row.detail,
      createdAt: row.createdAt.toISOString(),
    };
  }

  async listByProject(projectId: string): Promise<AuditEntry[]> {
    const rows = await this.db
      .select()
      .from(auditEntries)
      .where(eq(auditEntries.projectId, projectId))
      .orderBy(desc(auditEntries.id));
    return rows.map((row) => ({
      id: row.id,
      projectId: row.projectId,
      actor: row.actor,
      action: row.action,
      subject: row.subject,
      detail: row.detail,
      createdAt: row.createdAt.toISOString(),
    }));
  }
}
