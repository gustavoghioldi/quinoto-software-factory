import { describe, expect, it } from "vitest";
import type { ArtifactKind, ArtifactRecord, ApprovalRecord } from "./artifacts.js";
import {
  advance,
  createWorkflowRun,
  failStage,
  retryFromCheckpoint,
  WorkflowError,
  type WorkflowRun,
} from "./workflow.js";

const at = (iso: string) => new Date(iso);

function artifact(kind: ArtifactKind): ArtifactRecord {
  return {
    id: `artifact-${kind}`,
    projectId: "project-1",
    kind,
    path: `.quinoto-spec/${kind}`,
    checksum: "abc123",
    createdAt: "2026-01-01T00:00:00.000Z",
  };
}

function approval(subject: string): ApprovalRecord {
  return {
    id: `approval-${subject}`,
    projectId: "project-1",
    subject,
    decision: "approved",
    decidedBy: "barba",
    decidedAt: "2026-01-01T00:00:00.000Z",
    scope: subject,
    rationale: "aprobado para el test",
  };
}

function context(artifacts: ArtifactRecord[] = [], approvals: ApprovalRecord[] = []) {
  return { artifacts, approvals };
}

function runToProposal(): WorkflowRun {
  const run = createWorkflowRun("project-1", { id: "run-1", now: at("2026-01-01T00:00:00Z") });
  return advance(run, "proposal", context([artifact("discovery")]), {
    now: at("2026-01-01T00:01:00Z"),
  });
}

describe("workflow state machine", () => {
  it("starts in discovery", () => {
    const run = createWorkflowRun("project-1", { id: "run-1" });
    expect(run.currentStage).toBe("discovery");
    expect(run.status).toBe("running");
    expect(run.stages.find((stage) => stage.stage === "discovery")?.status).toBe("active");
  });

  it("blocks entering proposal without the discovery artifact", () => {
    const run = createWorkflowRun("project-1", { id: "run-1" });
    expect(() => advance(run, "proposal", context())).toThrow(WorkflowError);
  });

  it("advances to proposal with the discovery artifact", () => {
    const run = runToProposal();
    expect(run.currentStage).toBe("proposal");
    expect(run.stages.find((stage) => stage.stage === "discovery")?.status).toBe("done");
    expect(run.stages.find((stage) => stage.stage === "proposal")?.status).toBe("active");
  });

  it("rejects an invalid transition", () => {
    const run = createWorkflowRun("project-1", { id: "run-1" });
    expect(() => advance(run, "tasks", context())).toThrow(
      expect.objectContaining({ code: "invalid_transition" }),
    );
  });

  it("blocks user stories without the proposal approval", () => {
    let run = runToProposal();
    run = advance(run, "approval_proposal", context([artifact("proposal")]));
    expect(() => advance(run, "user_stories", context([artifact("proposal")]))).toThrow(
      expect.objectContaining({ code: "gate_blocked" }),
    );
  });

  it("advances to user stories with the proposal approval", () => {
    let run = runToProposal();
    run = advance(run, "approval_proposal", context([artifact("proposal")]));
    run = advance(run, "user_stories", context([artifact("proposal")], [approval("proposal")]));
    expect(run.currentStage).toBe("user_stories");
  });

  it("marks the run as completed when reaching done", () => {
    let run = runToProposal();
    run = advance(run, "approval_proposal", context([artifact("proposal")]));
    run = advance(run, "user_stories", context([artifact("proposal")], [approval("proposal")]));
    run = advance(run, "tasks", context([artifact("user-stories")]));
    run = advance(run, "apply", context([artifact("tasks")]));
    run = advance(run, "review_diff", context());
    run = advance(run, "pull_request", context([], [approval("diff")]));
    run = advance(run, "done", context([artifact("pull-request")]));
    expect(run.status).toBe("completed");
    expect(run.currentStage).toBe("done");
  });
});

describe("retry from checkpoint", () => {
  it("resumes the failed stage without touching completed stages", () => {
    let run = runToProposal();
    run = failStage(run, "agent crashed", { now: at("2026-01-01T00:02:00Z") });
    expect(run.status).toBe("failed");

    const retried = retryFromCheckpoint(run, { now: at("2026-01-01T00:03:00Z") });
    expect(retried.currentStage).toBe("proposal");
    expect(retried.status).toBe("running");
    expect(retried.stages.find((stage) => stage.stage === "proposal")?.attempts).toBe(2);
    expect(retried.stages.find((stage) => stage.stage === "discovery")?.status).toBe("done");
    expect(retried.stages.find((stage) => stage.stage === "proposal")?.error).toBeNull();
  });

  it("fails when there is no retryable stage", () => {
    const run = createWorkflowRun("project-1", { id: "run-1" });
    expect(() => retryFromCheckpoint(run)).toThrow(
      expect.objectContaining({ code: "no_retryable_stage" }),
    );
  });
});
