import { randomUUID } from "node:crypto";
import { describe, expect, it } from "vitest";
import { buildServer } from "../src/server.js";
import { makeDeps, seedInstallation, type TestDeps } from "./helpers.js";

async function seedProject(deps: TestDeps): Promise<string> {
  await seedInstallation(deps);
  const project = await deps.projects.create({
    name: "Web App",
    repoFullName: "acme/web",
    defaultBranch: "main",
    installationId: 99,
  });
  return project.id;
}

async function addArtifact(deps: TestDeps, projectId: string, kind: "discovery" | "proposal") {
  await deps.artifactRepository.create({
    id: randomUUID(),
    projectId,
    kind,
    path: `.quinoto-spec/${kind}`,
    checksum: "abc",
    createdAt: new Date().toISOString(),
  });
}

describe("workflow routes", () => {
  it("starts a workflow in discovery", async () => {
    const deps = makeDeps();
    const projectId = await seedProject(deps);
    const app = buildServer({ deps });

    const response = await app.inject({
      method: "POST",
      url: `/projects/${projectId}/workflow/start`,
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({ projectId, currentStage: "discovery" });
    await app.close();
  });

  it("blocks a transition without the required artifact", async () => {
    const deps = makeDeps();
    const projectId = await seedProject(deps);
    const app = buildServer({ deps });
    await app.inject({ method: "POST", url: `/projects/${projectId}/workflow/start` });

    const response = await app.inject({
      method: "POST",
      url: `/projects/${projectId}/workflow/advance`,
      payload: { target: "proposal" },
    });

    expect(response.statusCode).toBe(409);
    expect(response.json()).toMatchObject({ code: "gate_blocked" });
    await app.close();
  });

  it("advances to user stories after approval", async () => {
    const deps = makeDeps();
    const projectId = await seedProject(deps);
    const app = buildServer({ deps });

    await app.inject({ method: "POST", url: `/projects/${projectId}/workflow/start` });
    await addArtifact(deps, projectId, "discovery");
    await app.inject({
      method: "POST",
      url: `/projects/${projectId}/workflow/advance`,
      payload: { target: "proposal" },
    });
    await addArtifact(deps, projectId, "proposal");
    await app.inject({
      method: "POST",
      url: `/projects/${projectId}/workflow/advance`,
      payload: { target: "approval_proposal" },
    });

    const approval = await app.inject({
      method: "POST",
      url: "/approvals",
      payload: {
        projectId,
        subject: "proposal",
        decision: "approved",
        decidedBy: "barba",
        scope: "proposal",
        rationale: "aprobado en el test",
      },
    });
    expect(approval.statusCode).toBe(201);

    const advanced = await app.inject({
      method: "POST",
      url: `/projects/${projectId}/workflow/advance`,
      payload: { target: "user_stories" },
    });
    expect(advanced.statusCode).toBe(200);
    expect(advanced.json()).toMatchObject({ currentStage: "user_stories" });
    await app.close();
  });

  it("retries a failed stage", async () => {
    const deps = makeDeps();
    const projectId = await seedProject(deps);
    await deps.workflows.start(projectId);
    await deps.workflows.fail(projectId, "agent crashed");
    const app = buildServer({ deps });

    const response = await app.inject({
      method: "POST",
      url: `/projects/${projectId}/workflow/retry`,
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({ currentStage: "discovery", status: "running" });
    await app.close();
  });
});
