import { describe, expect, it } from "vitest";
import { buildServer } from "../src/server.js";
import { makeDeps, seedInstallation } from "./helpers.js";

describe("projects overview", () => {
  it("aggregates workflow, sessions, PRs and deploy", async () => {
    const deps = makeDeps();
    await seedInstallation(deps);
    const project = await deps.projects.create({
      name: "Web App",
      repoFullName: "acme/web",
      defaultBranch: "main",
      installationId: 99,
    });

    await deps.workflows.start(project.id);
    const session = await deps.agentRuntime.start({
      projectId: project.id,
      stage: "apply",
      prompt: "x",
    });
    await deps.agentRuntime.appendEvent(session.id, "pull_request", {
      number: 1,
      url: "https://github.com/acme/web/pull/1",
    });
    await deps.railwayLinks.upsert({
      projectId: project.id,
      railwayProjectId: "rp-1",
      serviceId: "svc-1",
      environmentId: "env-1",
    });

    const app = buildServer({ deps });
    const response = await app.inject({ method: "GET", url: "/projects/overview" });

    expect(response.statusCode).toBe(200);
    const overview = response.json().projects[0];
    expect(overview).toMatchObject({
      id: project.id,
      activeSessions: 1,
      pullRequests: [{ number: 1, url: "https://github.com/acme/web/pull/1" }],
      deploy: { status: null, url: null },
    });
    expect(overview.workflow).toMatchObject({ currentStage: "discovery" });
    await app.close();
  });
});
