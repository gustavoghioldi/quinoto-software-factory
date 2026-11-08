import { ProtectedBranchError } from "@factory/adapters-github";
import type { FastifyInstance } from "fastify";
import type { ApiDependencies } from "../deps.js";

interface PullRequestBody {
  title?: string;
  body?: string;
  baseBranch?: string;
}

export async function registerDeliveryRoutes(
  app: FastifyInstance,
  deps: ApiDependencies,
): Promise<void> {
  app.get("/sessions/:id/diff", async (request, reply) => {
    const id = (request.params as { id: string }).id;
    const session = await deps.agentRuntime.get(id);
    if (!session) {
      return reply.code(404).send({ error: "session_not_found" });
    }

    const events = await deps.agentRuntime.events(id);
    const diff = [...events].reverse().find((event) => event.type === "diff");
    if (!diff) {
      return reply.code(404).send({ error: "diff_not_found" });
    }

    return diff.payload;
  });

  app.post("/sessions/:id/pull-request", async (request, reply) => {
    const id = (request.params as { id: string }).id;
    const body = (request.body ?? {}) as PullRequestBody;
    if (!body.title) {
      return reply.code(400).send({ error: "missing_title" });
    }

    const session = await deps.agentRuntime.get(id);
    if (!session) {
      return reply.code(404).send({ error: "session_not_found" });
    }

    const project = await deps.projects.findById(session.projectId);
    if (!project) {
      return reply.code(404).send({ error: "project_not_found" });
    }

    const latest = await deps.installations.findLatest();
    if (!latest?.installationId) {
      return reply.code(409).send({ error: "github_app_not_installed" });
    }

    const [owner, repo] = project.repoFullName.split("/");
    if (!owner || !repo) {
      return reply.code(400).send({ error: "invalid_repository" });
    }

    const token = await deps.github.getInstallationToken(latest.installationId);
    const head = `factory/${session.id}`;

    try {
      const pullRequest = await deps.github.openPullRequest({
        token,
        owner,
        repo,
        head,
        base: body.baseBranch ?? project.defaultBranch,
        title: body.title,
        body: body.body ?? "",
      });

      await deps.agentRuntime.appendEvent(id, "pull_request", {
        number: pullRequest.number,
        url: pullRequest.url,
      });
      await deps.audit.record({
        projectId: project.id,
        actor: "factory",
        action: "pull_request.opened",
        subject: head,
        detail: { number: pullRequest.number, url: pullRequest.url },
      });

      return reply.code(201).send(pullRequest);
    } catch (error) {
      if (error instanceof ProtectedBranchError) {
        return reply.code(409).send({ error: "protected_branch", message: error.message });
      }
      throw error;
    }
  });
}
