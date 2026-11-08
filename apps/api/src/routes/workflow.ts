import type { Stage } from "@factory/core";
import type { FastifyInstance } from "fastify";
import { WorkflowError } from "@factory/core";
import type { ApiDependencies } from "../deps.js";

function workflowError(error: unknown): { code: string; message: string } | null {
  if (error instanceof WorkflowError) {
    return { code: error.code, message: error.message };
  }
  return null;
}

export async function registerWorkflowRoutes(
  app: FastifyInstance,
  deps: ApiDependencies,
): Promise<void> {
  app.post("/projects/:id/workflow/start", async (request, reply) => {
    const { id } = request.params as { id: string };
    const project = await deps.projects.findById(id);
    if (!project) {
      return reply.code(404).send({ error: "project_not_found" });
    }
    return deps.workflows.start(id);
  });

  app.get("/projects/:id/workflow", async (request, reply) => {
    const { id } = request.params as { id: string };
    const run = await deps.workflows.get(id);
    if (!run) {
      return reply.code(404).send({ error: "workflow_not_started" });
    }
    return run;
  });

  app.post("/projects/:id/workflow/advance", async (request, reply) => {
    const { id } = request.params as { id: string };
    const { target } = (request.body ?? {}) as { target?: Stage };
    if (!target) {
      return reply.code(400).send({ error: "missing_target" });
    }
    try {
      return await deps.workflows.advance(id, target);
    } catch (error) {
      const mapped = workflowError(error);
      if (mapped) {
        return reply.code(409).send(mapped);
      }
      throw error;
    }
  });

  app.post("/projects/:id/workflow/retry", async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      return await deps.workflows.retry(id);
    } catch (error) {
      const mapped = workflowError(error);
      if (mapped) {
        return reply.code(409).send(mapped);
      }
      throw error;
    }
  });
}
