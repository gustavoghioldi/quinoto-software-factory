import type { ApprovalDecision } from "@factory/core";
import type { FastifyInstance } from "fastify";
import type { ApiDependencies } from "../deps.js";

interface CreateApprovalBody {
  projectId?: string;
  subject?: string;
  decision?: ApprovalDecision;
  decidedBy?: string;
  scope?: string;
  rationale?: string;
}

export async function registerApprovalRoutes(
  app: FastifyInstance,
  deps: ApiDependencies,
): Promise<void> {
  app.get("/approvals", async (request, reply) => {
    const { projectId } = request.query as { projectId?: string };
    if (!projectId) {
      return reply.code(400).send({ error: "missing_project_id" });
    }
    return { approvals: await deps.workflows.listApprovals(projectId) };
  });

  app.post("/approvals", async (request, reply) => {
    const body = (request.body ?? {}) as CreateApprovalBody;
    if (
      !body.projectId ||
      !body.subject ||
      !body.decision ||
      !body.decidedBy ||
      !body.scope ||
      !body.rationale
    ) {
      return reply.code(400).send({ error: "invalid_approval" });
    }
    if (body.decision !== "approved" && body.decision !== "rejected") {
      return reply.code(400).send({ error: "invalid_decision" });
    }

    const project = await deps.projects.findById(body.projectId);
    if (!project) {
      return reply.code(404).send({ error: "project_not_found" });
    }

    const approval = await deps.workflows.approve({
      projectId: body.projectId,
      subject: body.subject,
      decision: body.decision,
      decidedBy: body.decidedBy,
      scope: body.scope,
      rationale: body.rationale,
    });
    await deps.audit.record({
      projectId: body.projectId,
      actor: body.decidedBy,
      action: "approval.created",
      subject: body.subject,
      detail: { decision: body.decision, scope: body.scope },
    });
    return reply.code(201).send(approval);
  });
}
