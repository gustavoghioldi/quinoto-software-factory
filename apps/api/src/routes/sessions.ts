import type { FastifyInstance } from "fastify";
import type { ApiDependencies } from "../deps.js";
import { SessionError } from "../services/agent-runtime.js";

interface StartSessionBody {
  stage?: string;
  prompt?: string;
  maxMinutes?: number;
}

export async function registerSessionRoutes(
  app: FastifyInstance,
  deps: ApiDependencies,
): Promise<void> {
  app.post("/projects/:id/sessions", async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = (request.body ?? {}) as StartSessionBody;
    if (!body.stage || !body.prompt) {
      return reply.code(400).send({ error: "invalid_session" });
    }

    const project = await deps.projects.findById(id);
    if (!project) {
      return reply.code(404).send({ error: "project_not_found" });
    }

    const session = await deps.agentRuntime.start({
      projectId: id,
      stage: body.stage,
      prompt: body.prompt,
      maxMinutes: body.maxMinutes,
    });
    return reply.code(201).send(session);
  });

  app.get("/sessions/:id", async (request, reply) => {
    const session = await deps.agentRuntime.get((request.params as { id: string }).id);
    if (!session) {
      return reply.code(404).send({ error: "session_not_found" });
    }
    return session;
  });

  app.post("/sessions/:id/cancel", async (request, reply) => {
    try {
      return await deps.agentRuntime.cancel((request.params as { id: string }).id);
    } catch (error) {
      if (error instanceof SessionError) {
        return reply
          .code(error.code === "session_not_found" ? 404 : 409)
          .send({ error: error.code, message: error.message });
      }
      throw error;
    }
  });

  app.get("/sessions/:id/events", async (request, reply) => {
    const id = (request.params as { id: string }).id;
    const session = await deps.agentRuntime.get(id);
    if (!session) {
      return reply.code(404).send({ error: "session_not_found" });
    }
    return { events: await deps.agentRuntime.events(id) };
  });
}
