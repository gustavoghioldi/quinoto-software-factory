import type { FastifyInstance, FastifyRequest } from "fastify";
import type { ApiDependencies } from "../deps.js";

interface GitHubInstallationPayload {
  action?: string;
  installation?: {
    id?: number;
    account?: { login?: string };
  };
}

type RawBodyRequest = FastifyRequest & { rawBody?: string };

export async function registerWebhookRoutes(
  app: FastifyInstance,
  deps: ApiDependencies,
): Promise<void> {
  app.post("/webhooks/github", async (request, reply) => {
    const rawBody = (request as RawBodyRequest).rawBody ?? JSON.stringify(request.body ?? {});
    const signatureHeader = request.headers["x-hub-signature-256"];
    const signature = Array.isArray(signatureHeader) ? signatureHeader[0] : signatureHeader;

    if (!(await deps.github.verifyWebhook(rawBody, signature))) {
      request.log.warn({ event: "github_webhook_rejected" }, "invalid webhook signature");
      return reply.code(401).send({ error: "invalid_signature" });
    }

    if (request.headers["x-github-event"] === "installation") {
      const payload = (request.body ?? {}) as GitHubInstallationPayload;
      const installationId = payload.installation?.id;
      if (installationId) {
        const latest = await deps.installations.findLatest();
        if (latest) {
          await deps.installations.updateInstallation(
            latest.id,
            installationId,
            payload.installation?.account?.login ?? "unknown",
          );
        }
      }
    }

    return { status: "accepted" };
  });
}
