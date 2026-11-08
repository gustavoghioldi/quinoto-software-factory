import { randomUUID } from "node:crypto";
import {
  advance,
  createWorkflowRun,
  failStage,
  retryFromCheckpoint,
  WorkflowError,
  type ApprovalRecord,
  type ArtifactRecord,
  type Stage,
  type WorkflowRun,
} from "@factory/core";
import type { ApprovalRepository, ArtifactRepository, WorkflowRepository } from "@factory/db";

export interface WorkflowServiceDeps {
  workflows: WorkflowRepository;
  artifacts: ArtifactRepository;
  approvals: ApprovalRepository;
}

export interface WorkflowService {
  start(projectId: string): Promise<WorkflowRun>;
  get(projectId: string): Promise<WorkflowRun | null>;
  advance(projectId: string, target: Stage): Promise<WorkflowRun>;
  fail(projectId: string, error: string): Promise<WorkflowRun>;
  retry(projectId: string): Promise<WorkflowRun>;
  recordArtifact(input: Omit<ArtifactRecord, "id" | "createdAt">): Promise<ArtifactRecord>;
  approve(input: Omit<ApprovalRecord, "id" | "decidedAt">): Promise<ApprovalRecord>;
  listApprovals(projectId: string): Promise<ApprovalRecord[]>;
}

export function createWorkflowService(deps: WorkflowServiceDeps): WorkflowService {
  async function load(projectId: string): Promise<WorkflowRun> {
    const run = await deps.workflows.findLatestByProject(projectId);
    if (!run) {
      throw new WorkflowError("invalid_transition", "workflow not started");
    }
    return run;
  }

  async function gateContext(projectId: string) {
    return {
      artifacts: await deps.artifacts.listByProject(projectId),
      approvals: await deps.approvals.listByProject(projectId),
    };
  }

  return {
    async start(projectId: string): Promise<WorkflowRun> {
      const existing = await deps.workflows.findLatestByProject(projectId);
      if (existing) {
        return existing;
      }
      const run = createWorkflowRun(projectId);
      await deps.workflows.createRun(run);
      return run;
    },

    get: (projectId: string) => deps.workflows.findLatestByProject(projectId),

    async advance(projectId: string, target: Stage): Promise<WorkflowRun> {
      const run = await load(projectId);
      const next = advance(run, target, await gateContext(projectId));
      await deps.workflows.saveRun(next);
      return next;
    },

    async fail(projectId: string, error: string): Promise<WorkflowRun> {
      const run = await load(projectId);
      const next = failStage(run, error);
      await deps.workflows.saveRun(next);
      return next;
    },

    async retry(projectId: string): Promise<WorkflowRun> {
      const run = await load(projectId);
      const next = retryFromCheckpoint(run);
      await deps.workflows.saveRun(next);
      return next;
    },

    async recordArtifact(input): Promise<ArtifactRecord> {
      const artifact: ArtifactRecord = {
        ...input,
        id: randomUUID(),
        createdAt: new Date().toISOString(),
      };
      await deps.artifacts.create(artifact);
      return artifact;
    },

    async approve(input): Promise<ApprovalRecord> {
      const approval: ApprovalRecord = {
        ...input,
        id: randomUUID(),
        decidedAt: new Date().toISOString(),
      };
      await deps.approvals.create(approval);
      return approval;
    },

    listApprovals: (projectId: string) => deps.approvals.listByProject(projectId),
  };
}
