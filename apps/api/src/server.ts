import { pathToFileURL } from "node:url";
import { loadConfig } from "@factory/core";
import cors from "@fastify/cors";
import Fastify, { type FastifyInstance, type FastifyRequest } from "fastify";
import { createDependencies } from "./bootstrap.js";
import type { ApiDependencies } from "./deps.js";
import { registerApprovalRoutes } from "./routes/approvals.js";
import { registerDeliveryRoutes } from "./routes/delivery.js";
import { registerDeploymentRoutes } from "./routes/deployments.js";
import { registerGitHubRoutes } from "./routes/github.js";
import { registerHealthRoutes, type ReadinessCheck } from "./routes/health.js";
import { registerProjectRoutes } from "./routes/projects.js";
import { registerSessionRoutes } from "./routes/sessions.js";
import { registerWebhookRoutes } from "./routes/webhooks.js";
import { registerWorkflowRoutes } from "./routes/workflow.js";

export interface BuildServerOptions {
  readiness?: ReadinessCheck;
  logger?: boolean;
  corsOrigins?: string[] | boolean;
  deps?: ApiDependencies;
}

export function buildServer(options: BuildServerOptions = {}): FastifyInstance {
  const app = Fastify({ logger: options.logger ?? false });
  const readiness: ReadinessCheck = options.readiness ?? (async () => ({}));

  void app.register(cors, { origin: options.corsOrigins ?? true });

  app.addContentTypeParser("application/json", { parseAs: "string" }, (request, body, done) => {
    (request as FastifyRequest & { rawBody?: string }).rawBody = body as string;
    try {
      done(null, JSON.parse(body as string));
    } catch (error) {
      done(error as Error, undefined);
    }
  });

  void app.register((instance) => registerHealthRoutes(instance, readiness));

  if (options.deps) {
    const deps = options.deps;
    void app.register((instance) => registerGitHubRoutes(instance, deps));
    void app.register((instance) => registerProjectRoutes(instance, deps));
    void app.register((instance) => registerWebhookRoutes(instance, deps));
    void app.register((instance) => registerWorkflowRoutes(instance, deps));
    void app.register((instance) => registerApprovalRoutes(instance, deps));
    void app.register((instance) => registerSessionRoutes(instance, deps));
    void app.register((instance) => registerDeliveryRoutes(instance, deps));
    void app.register((instance) => registerDeploymentRoutes(instance, deps));
  }

  return app;
}

export async function start(): Promise<void> {
  const config = loadConfig();
  const corsOrigins = config.CORS_ORIGINS.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  const deps = await createDependencies(config);
  const app = buildServer({ logger: true, corsOrigins, deps });
  await app.listen({ port: config.PORT, host: "0.0.0.0" });
}

const entrypoint = process.argv[1];
if (entrypoint && import.meta.url === pathToFileURL(entrypoint).href) {
  start().catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  });
}
