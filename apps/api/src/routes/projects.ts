import type { FastifyInstance } from "fastify";
import type { ApiDependencies } from "../deps.js";

interface CreateProjectBody {
  name?: string;
  repoFullName?: string;
  defaultBranch?: string;
}

export async function registerProjectRoutes(
  app: FastifyInstance,
  deps: ApiDependencies,
): Promise<void> {
  app.get("/projects", async () => ({ projects: await deps.projects.list() }));

  app.post("/projects", async (request, reply) => {
    const body = (request.body ?? {}) as CreateProjectBody;
    if (!body.name || !body.repoFullName || !body.defaultBranch) {
      return reply.code(400).send({ error: "invalid_project" });
    }

    const latest = await deps.installations.findLatest();
    if (!latest?.installationId) {
      return reply.code(409).send({ error: "github_app_not_installed" });
    }

    const project = await deps.projects.create({
      name: body.name,
      repoFullName: body.repoFullName,
      defaultBranch: body.defaultBranch,
      installationId: latest.installationId,
    });

    return reply.code(201).send(project);
  });
}
