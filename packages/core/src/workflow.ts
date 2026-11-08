import { randomUUID } from "node:crypto";
import {
  hasApproval,
  hasArtifact,
  type ApprovalRecord,
  type ArtifactKind,
  type ArtifactRecord,
} from "./artifacts.js";

export const STAGES = [
  "discovery",
  "proposal",
  "approval_proposal",
  "user_stories",
  "tasks",
  "apply",
  "review_diff",
  "pull_request",
  "done",
] as const;

export type Stage = (typeof STAGES)[number];
export type StageStatus = "pending" | "active" | "done" | "failed" | "blocked";
export type RunStatus = "running" | "blocked" | "completed" | "failed";

export interface StageRecord {
  stage: Stage;
  status: StageStatus;
  attempts: number;
  startedAt: string | null;
  finishedAt: string | null;
  error: string | null;
}

export interface WorkflowRun {
  id: string;
  projectId: string;
  currentStage: Stage;
  status: RunStatus;
  stages: StageRecord[];
}

export interface GateContext {
  artifacts: ArtifactRecord[];
  approvals: ApprovalRecord[];
}

export type WorkflowErrorCode = "invalid_transition" | "gate_blocked" | "no_retryable_stage";

export class WorkflowError extends Error {
  constructor(
    public readonly code: WorkflowErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "WorkflowError";
  }
}

const TRANSITIONS: Record<Stage, Stage[]> = {
  discovery: ["proposal"],
  proposal: ["approval_proposal"],
  approval_proposal: ["user_stories", "proposal"],
  user_stories: ["tasks"],
  tasks: ["apply"],
  apply: ["review_diff"],
  review_diff: ["apply", "pull_request"],
  pull_request: ["done"],
  done: [],
};

interface GateRequirement {
  artifacts?: ArtifactKind[];
  approval?: string;
}

const GATES: Partial<Record<Stage, GateRequirement>> = {
  proposal: { artifacts: ["discovery"] },
  approval_proposal: { artifacts: ["proposal"] },
  user_stories: { artifacts: ["proposal"], approval: "proposal" },
  tasks: { artifacts: ["user-stories"] },
  apply: { artifacts: ["tasks"] },
  pull_request: { approval: "diff" },
  done: { artifacts: ["pull-request"] },
};

export interface CreateRunOptions {
  id?: string;
  now?: Date;
}

export function createWorkflowRun(projectId: string, options: CreateRunOptions = {}): WorkflowRun {
  const now = (options.now ?? new Date()).toISOString();
  const stages: StageRecord[] = STAGES.map((stage) => ({
    stage,
    status: stage === "discovery" ? "active" : "pending",
    attempts: stage === "discovery" ? 1 : 0,
    startedAt: stage === "discovery" ? now : null,
    finishedAt: null,
    error: null,
  }));

  return {
    id: options.id ?? randomUUID(),
    projectId,
    currentStage: "discovery",
    status: "running",
    stages,
  };
}

export function canTransition(run: WorkflowRun, target: Stage): boolean {
  return TRANSITIONS[run.currentStage].includes(target);
}

export function validateGate(run: WorkflowRun, target: Stage, context: GateContext): void {
  const requirement = GATES[target];
  if (!requirement) {
    return;
  }

  const missingArtifacts = (requirement.artifacts ?? []).filter(
    (kind) => !hasArtifact(context.artifacts, kind),
  );
  if (missingArtifacts.length > 0) {
    throw new WorkflowError("gate_blocked", `missing artifacts: ${missingArtifacts.join(", ")}`);
  }

  if (requirement.approval && !hasApproval(context.approvals, requirement.approval)) {
    throw new WorkflowError("gate_blocked", `missing approval: ${requirement.approval}`);
  }
}

export interface AdvanceOptions {
  now?: Date;
}

export function advance(
  run: WorkflowRun,
  target: Stage,
  context: GateContext,
  options: AdvanceOptions = {},
): WorkflowRun {
  if (!canTransition(run, target)) {
    throw new WorkflowError(
      "invalid_transition",
      `cannot transition from ${run.currentStage} to ${target}`,
    );
  }

  validateGate(run, target, context);

  const now = (options.now ?? new Date()).toISOString();
  const stages = run.stages.map((record) => {
    if (record.stage === run.currentStage) {
      return { ...record, status: "done" as const, finishedAt: now };
    }
    if (record.stage === target) {
      return {
        ...record,
        status: "active" as const,
        attempts: record.attempts + 1,
        startedAt: now,
        finishedAt: null,
        error: null,
      };
    }
    return record;
  });

  return {
    ...run,
    currentStage: target,
    status: target === "done" ? "completed" : "running",
    stages,
  };
}

export function failStage(
  run: WorkflowRun,
  error: string,
  options: { now?: Date } = {},
): WorkflowRun {
  const now = (options.now ?? new Date()).toISOString();
  return {
    ...run,
    status: "failed",
    stages: run.stages.map((record) =>
      record.stage === run.currentStage
        ? { ...record, status: "failed", error, finishedAt: now }
        : record,
    ),
  };
}

export function retryFromCheckpoint(run: WorkflowRun, options: { now?: Date } = {}): WorkflowRun {
  const retryable = run.stages.find(
    (record) => record.status === "failed" || record.status === "blocked",
  );
  if (!retryable) {
    throw new WorkflowError(
      "no_retryable_stage",
      "workflow has no failed or blocked stage to retry",
    );
  }

  const now = (options.now ?? new Date()).toISOString();
  return {
    ...run,
    currentStage: retryable.stage,
    status: "running",
    stages: run.stages.map((record) =>
      record.stage === retryable.stage
        ? {
            ...record,
            status: "active",
            attempts: record.attempts + 1,
            startedAt: now,
            finishedAt: null,
            error: null,
          }
        : record,
    ),
  };
}
