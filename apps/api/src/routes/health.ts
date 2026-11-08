import type { FastifyInstance } from "fastify";

export type DependencyStatus = "ok" | "down";
export type ReadinessCheck = () => Promise<Record<string, DependencyStatus>>;

export async function registerHealthRoutes(
  app: FastifyInstance,
  readiness: ReadinessCheck,
): Promise<void> {
  app.get("/healthz", async () => ({ status: "ok" }));

  app.get("/readyz", async (_request, reply) => {
    const dependencies = await readiness();
    const failing = Object.entries(dependencies)
      .filter(([, status]) => status === "down")
      .map(([name]) => name);

    if (failing.length > 0) {
      return reply.code(503).send({
        status: "unavailable",
        dependencies,
        failing,
      });
    }

    return { status: "ok", dependencies };
  });
}
