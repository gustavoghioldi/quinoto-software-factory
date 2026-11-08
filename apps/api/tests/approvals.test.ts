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

describe("approval routes", () => {
  it("creates and lists approvals", async () => {
    const deps = makeDeps();
    const projectId = await seedProject(deps);
    const app = buildServer({ deps });

    const created = await app.inject({
      method: "POST",
      url: "/approvals",
      payload: {
        projectId,
        subject: "proposal",
        decision: "approved",
        decidedBy: "barba",
        scope: "proposal",
        rationale: "ok",
      },
    });
    expect(created.statusCode).toBe(201);

    const listed = await app.inject({ method: "GET", url: `/approvals?projectId=${projectId}` });
    expect(listed.statusCode).toBe(200);
    expect(listed.json().approvals).toHaveLength(1);
    await app.close();
  });

  it("rejects an invalid decision", async () => {
    const deps = makeDeps();
    const projectId = await seedProject(deps);
    const app = buildServer({ deps });

    const response = await app.inject({
      method: "POST",
      url: "/approvals",
      payload: {
        projectId,
        subject: "proposal",
        decision: "maybe",
        decidedBy: "barba",
        scope: "proposal",
        rationale: "ok",
      },
    });

    expect(response.statusCode).toBe(400);
    await app.close();
  });

  it("returns 404 for an unknown project", async () => {
    const app = buildServer({ deps: makeDeps() });
    const response = await app.inject({
      method: "POST",
      url: "/approvals",
      payload: {
        projectId: "00000000-0000-0000-0000-000000000000",
        subject: "proposal",
        decision: "approved",
        decidedBy: "barba",
        scope: "proposal",
        rationale: "ok",
      },
    });

    expect(response.statusCode).toBe(404);
    await app.close();
  });
});
