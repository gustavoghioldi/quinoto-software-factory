export type ArtifactKind =
  "discovery" | "proposal" | "user-stories" | "tasks" | "diff" | "pull-request";

export interface ArtifactRecord {
  id: string;
  projectId: string;
  kind: ArtifactKind;
  path: string;
  checksum: string;
  createdAt: string;
}

export type ApprovalDecision = "approved" | "rejected";

export interface ApprovalRecord {
  id: string;
  projectId: string;
  subject: string;
  decision: ApprovalDecision;
  decidedBy: string;
  decidedAt: string;
  scope: string;
  rationale: string;
}

export function hasArtifact(artifacts: ArtifactRecord[], kind: ArtifactKind): boolean {
  return artifacts.some((artifact) => artifact.kind === kind);
}

export function hasApproval(approvals: ApprovalRecord[], subject: string): boolean {
  return approvals.some(
    (approval) => approval.subject === subject && approval.decision === "approved",
  );
}
