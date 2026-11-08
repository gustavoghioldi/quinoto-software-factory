import type { FastifyInstance } from "fastify";
import type { ApiDependencies } from "../deps.js";

export async function registerAuditRoutes(
  app: FastifyInstance,
  deps: ApiDependencies,
): Promise<void> {
  app.get("/audit", async (request, reply) => {
    const { projectId } = request.query as { projectId?: string };
    if (!projectId) {
      return reply.code(400).send({ error: "missing_project_id" });
    }
    return { entries: await deps.audit.list(projectId) };
  });
}
