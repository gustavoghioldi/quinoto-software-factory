import { describe, expect, it } from "vitest";
import { buildServer } from "../src/server.js";
import { makeDeps, seedInstallation, type TestDeps } from "./helpers.js";

async function seedProjectWithSession(deps: TestDeps) {
  await seedInstallation(deps);
  const project = await deps.projects.create({
    name: "Web App",
    repoFullName: "acme/web",
    defaultBranch: "main",
    installationId: 99,
  });
  const session = await deps.agentRuntime.start({
    projectId: project.id,
    stage: "apply",
    prompt: "implement the task",
  });
  await deps.agentRuntime.appendEvent(session.id, "diff", {
    files: [{ path: "src/a.ts", patch: "+hello" }],
  });
  return { projectId: project.id, sessionId: session.id };
}

describe("delivery routes", () => {
  it("returns the session diff", async () => {
    const deps = makeDeps();
    const { sessionId } = await seedProjectWithSession(deps);
    const app = buildServer({ deps });

    const response = await app.inject({ method: "GET", url: `/sessions/${sessionId}/diff` });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ files: [{ path: "src/a.ts", patch: "+hello" }] });
    await app.close();
  });

  it("opens a pull request and records an audit event", async () => {
    const deps = makeDeps();
    const { sessionId } = await seedProjectWithSession(deps);
    const app = buildServer({ deps });

    const response = await app.inject({
      method: "POST",
      url: `/sessions/${sessionId}/pull-request`,
      payload: { title: "feat: add login", baseBranch: "main" },
    });

    expect(response.statusCode).toBe(201);
    expect(response.json()).toEqual({
      number: 1,
      url: "https://github.com/acme/web/pull/1",
    });

    const events = await deps.agentRuntime.events(sessionId);
    expect(events.some((event) => event.type === "pull_request")).toBe(true);
    await app.close();
  });

  it("returns 404 when there is no diff", async () => {
    const deps = makeDeps();
    await seedInstallation(deps);
    const project = await deps.projects.create({
      name: "Web App",
      repoFullName: "acme/web",
      defaultBranch: "main",
      installationId: 99,
    });
    const session = await deps.agentRuntime.start({
      projectId: project.id,
      stage: "apply",
      prompt: "x",
    });
    const app = buildServer({ deps });

    const response = await app.inject({ method: "GET", url: `/sessions/${session.id}/diff` });

    expect(response.statusCode).toBe(404);
    await app.close();
  });

  it("returns 409 without a GitHub installation", async () => {
    const deps = makeDeps();
    const project = await deps.projects.create({
      name: "Web App",
      repoFullName: "acme/web",
      defaultBranch: "main",
      installationId: 99,
    });
    const session = await deps.agentRuntime.start({
      projectId: project.id,
      stage: "apply",
      prompt: "x",
    });
    const app = buildServer({ deps });

    const response = await app.inject({
      method: "POST",
      url: `/sessions/${session.id}/pull-request`,
      payload: { title: "x" },
    });

    expect(response.statusCode).toBe(409);
    await app.close();
  });
});
