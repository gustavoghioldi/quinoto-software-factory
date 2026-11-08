import { pathToFileURL } from "node:url";
import { loadConfig } from "@factory/core";
import Fastify, { type FastifyInstance } from "fastify";
import { registerHealthRoutes, type ReadinessCheck } from "./routes/health.js";

export interface BuildServerOptions {
  readiness?: ReadinessCheck;
  logger?: boolean;
}

export function buildServer(options: BuildServerOptions = {}): FastifyInstance {
  const app = Fastify({ logger: options.logger ?? false });
  const readiness: ReadinessCheck = options.readiness ?? (async () => ({}));
  void app.register((instance) => registerHealthRoutes(instance, readiness));
  return app;
}

export async function start(): Promise<void> {
  const config = loadConfig();
  const app = buildServer({ logger: true });
  await app.listen({ port: config.PORT, host: "0.0.0.0" });
}

const entrypoint = process.argv[1];
if (entrypoint && import.meta.url === pathToFileURL(entrypoint).href) {
  start().catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  });
}
