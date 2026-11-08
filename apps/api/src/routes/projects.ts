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

  app.get("/projects/overview", async () => {
    const projects = await deps.projects.list();
    const overview = await Promise.all(
      projects.map(async (project) => {
        const workflow = await deps.workflows.get(project.id);
        const sessions = await deps.agentRuntime.listByProject(project.id);
        const activeSessions = sessions.filter(
          (session) => session.status === "running" || session.status === "provisioning",
        ).length;

        const pullRequests: unknown[] = [];
        for (const session of sessions) {
          const events = await deps.agentRuntime.events(session.id);
          for (const event of events) {
            if (event.type === "pull_request") {
              pullRequests.push(event.payload);
            }
          }
        }

        const link = await deps.railwayLinks.findByProject(project.id);
        return {
          id: project.id,
          name: project.name,
          repoFullName: project.repoFullName,
          defaultBranch: project.defaultBranch,
          status: project.status,
          workflow: workflow
            ? { currentStage: workflow.currentStage, status: workflow.status }
            : null,
          activeSessions,
          pullRequests,
          deploy: link ? { status: link.lastDeployStatus, url: link.lastDeployUrl } : null,
        };
      }),
    );

    return { projects: overview };
  });

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
