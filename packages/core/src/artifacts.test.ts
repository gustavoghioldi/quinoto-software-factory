import { describe, expect, it } from "vitest";
import { hasApproval, hasArtifact, type ArtifactRecord, type ApprovalRecord } from "./artifacts.js";

const artifact: ArtifactRecord = {
  id: "a1",
  projectId: "p1",
  kind: "proposal",
  path: ".quinoto-spec/proposals/x/proposal.md",
  checksum: "abc",
  createdAt: "2026-01-01T00:00:00.000Z",
};

const approval: ApprovalRecord = {
  id: "ap1",
  projectId: "p1",
  subject: "proposal",
  decision: "approved",
  decidedBy: "barba",
  decidedAt: "2026-01-01T00:00:00.000Z",
  scope: "proposal",
  rationale: "ok",
};

describe("artifacts", () => {
  it("detects an artifact by kind", () => {
    expect(hasArtifact([artifact], "proposal")).toBe(true);
    expect(hasArtifact([artifact], "tasks")).toBe(false);
  });

  it("only counts approved approvals", () => {
    expect(hasApproval([approval], "proposal")).toBe(true);
    expect(hasApproval([{ ...approval, decision: "rejected" }], "proposal")).toBe(false);
    expect(hasApproval([approval], "diff")).toBe(false);
  });
});
