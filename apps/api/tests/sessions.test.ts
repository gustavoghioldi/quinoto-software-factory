import { describe, expect, it } from "vitest";
import { buildServer } from "../src/server.js";
import { makeDeps, seedInstallation } from "./helpers.js";

async function seedProject(deps: ReturnType<typeof makeDeps>): Promise<string> {
  await seedInstallation(deps);
  const project = await deps.projects.create({
    name: "Web App",
    repoFullName: "acme/web",
    defaultBranch: "main",
    installationId: 99,
  });
  return project.id;
}

describe("session routes", () => {
  it("starts, reads and cancels a session", async () => {
    const deps = makeDeps();
    const projectId = await seedProject(deps);
    const app = buildServer({ deps });

    const started = await app.inject({
      method: "POST",
      url: `/projects/${projectId}/sessions`,
      payload: { stage: "apply", prompt: "implement the task" },
    });
    expect(started.statusCode).toBe(201);
    const session = started.json() as { id: string; status: string };
    expect(session.status).toBe("running");

    const fetched = await app.inject({ method: "GET", url: `/sessions/${session.id}` });
    expect(fetched.statusCode).toBe(200);

    const events = await app.inject({ method: "GET", url: `/sessions/${session.id}/events` });
    expect(events.statusCode).toBe(200);
    expect(events.json()).toEqual({ events: [] });

    const cancelled = await app.inject({
      method: "POST",
      url: `/sessions/${session.id}/cancel`,
    });
    expect(cancelled.statusCode).toBe(200);
    expect(cancelled.json()).toMatchObject({ status: "cancelled" });
    await app.close();
  });

  it("rejects an invalid session payload", async () => {
    const deps = makeDeps();
    const projectId = await seedProject(deps);
    const app = buildServer({ deps });

    const response = await app.inject({
      method: "POST",
      url: `/projects/${projectId}/sessions`,
      payload: { stage: "apply" },
    });

    expect(response.statusCode).toBe(400);
    await app.close();
  });

  it("returns 404 for an unknown session", async () => {
    const app = buildServer({ deps: makeDeps() });
    const response = await app.inject({ method: "GET", url: "/sessions/missing" });

    expect(response.statusCode).toBe(404);
    await app.close();
  });

  it("streams existing events as SSE", async () => {
    const deps = makeDeps();
    const projectId = await seedProject(deps);
    const app = buildServer({ deps });
    const started = await app.inject({
      method: "POST",
      url: `/projects/${projectId}/sessions`,
      payload: { stage: "apply", prompt: "x" },
    });
    const session = started.json() as { id: string };
    await deps.agentRuntime.appendEvent(session.id, "message", { text: "hola" });

    const stream = await app.inject({
      method: "GET",
      url: `/sessions/${session.id}/events/stream?once=1`,
    });

    expect(stream.statusCode).toBe(200);
    expect(stream.headers["content-type"]).toContain("text/event-stream");
    expect(stream.body).toContain("message");
    await app.close();
  });
});
