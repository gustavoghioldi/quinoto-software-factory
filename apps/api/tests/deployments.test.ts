import { describe, expect, it } from "vitest";
import { buildServer } from "../src/server.js";
import { makeDeps, seedInstallation, type TestDeps } from "./helpers.js";

async function seedProject(deps: TestDeps) {
  await seedInstallation(deps);
  return deps.projects.create({
    name: "Web App",
    repoFullName: "acme/web",
    defaultBranch: "main",
    installationId: 99,
  });
}

describe("deployment routes", () => {
  it("links Railway and triggers a deploy", async () => {
    const deps = makeDeps();
    const project = await seedProject(deps);
    const app = buildServer({ deps });

    const link = await app.inject({
      method: "POST",
      url: `/projects/${project.id}/railway`,
      payload: { railwayProjectId: "rp-1", serviceId: "svc-1", environmentId: "env-1" },
    });
    expect(link.statusCode).toBe(201);

    const deploy = await app.inject({ method: "POST", url: `/projects/${project.id}/deploy` });
    expect(deploy.statusCode).toBe(201);
    expect(deploy.json()).toMatchObject({ status: "building" });

    const status = await app.inject({ method: "GET", url: `/projects/${project.id}/deploy` });
    expect(status.statusCode).toBe(200);
    expect(status.json()).toMatchObject({ status: "building" });
    await app.close();
  });

  it("returns 409 when Railway is not linked", async () => {
    const deps = makeDeps();
    const project = await seedProject(deps);
    const app = buildServer({ deps });

    const response = await app.inject({ method: "POST", url: `/projects/${project.id}/deploy` });

    expect(response.statusCode).toBe(409);
    await app.close();
  });
});
