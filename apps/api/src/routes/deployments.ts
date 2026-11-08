import type { FastifyInstance } from "fastify";
import type { ApiDependencies } from "../deps.js";

interface LinkRailwayBody {
  railwayProjectId?: string;
  serviceId?: string;
  environmentId?: string;
}

export async function registerDeploymentRoutes(
  app: FastifyInstance,
  deps: ApiDependencies,
): Promise<void> {
  app.post("/projects/:id/railway", async (request, reply) => {
    const id = (request.params as { id: string }).id;
    const body = (request.body ?? {}) as LinkRailwayBody;
    if (!body.railwayProjectId || !body.serviceId || !body.environmentId) {
      return reply.code(400).send({ error: "invalid_railway_link" });
    }

    const project = await deps.projects.findById(id);
    if (!project) {
      return reply.code(404).send({ error: "project_not_found" });
    }

    const link = await deps.railwayLinks.upsert({
      projectId: id,
      railwayProjectId: body.railwayProjectId,
      serviceId: body.serviceId,
      environmentId: body.environmentId,
    });
    await deps.audit.record({
      projectId: id,
      actor: "operator",
      action: "railway.linked",
      subject: body.railwayProjectId,
      detail: { serviceId: body.serviceId, environmentId: body.environmentId },
    });
    return reply.code(201).send(link);
  });

  app.get("/projects/:id/railway", async (request, reply) => {
    const id = (request.params as { id: string }).id;
    const link = await deps.railwayLinks.findByProject(id);
    if (!link) {
      return reply.code(404).send({ error: "railway_not_linked" });
    }
    return link;
  });

  app.post("/projects/:id/deploy", async (request, reply) => {
    const id = (request.params as { id: string }).id;
    const link = await deps.railwayLinks.findByProject(id);
    if (!link) {
      return reply.code(409).send({ error: "railway_not_linked" });
    }

    const deployment = await deps.railway.triggerDeploy({
      railwayProjectId: link.railwayProjectId,
      serviceId: link.serviceId,
      environmentId: link.environmentId,
    });
    await deps.railwayLinks.updateDeployment(id, {
      id: deployment.id,
      status: deployment.status,
      url: deployment.url,
    });
    await deps.audit.record({
      projectId: id,
      actor: "operator",
      action: "deploy.triggered",
      subject: deployment.id,
      detail: { status: deployment.status },
    });
    return reply.code(201).send(deployment);
  });

  app.get("/projects/:id/deploy", async (request, reply) => {
    const id = (request.params as { id: string }).id;
    const link = await deps.railwayLinks.findByProject(id);
    if (!link) {
      return reply.code(409).send({ error: "railway_not_linked" });
    }
    if (!link.lastDeploymentId) {
      return { status: null, url: null };
    }
    const deployment = await deps.railway.getDeployment(link.lastDeploymentId);
    return deployment ?? { status: link.lastDeployStatus, url: link.lastDeployUrl };
  });
}
