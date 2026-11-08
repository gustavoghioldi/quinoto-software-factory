import { describe, expect, it } from "vitest";
import { buildServer } from "../src/server.js";
import { makeDeps, seedInstallation } from "./helpers.js";

describe("audit routes", () => {
  it("records and lists redacted audit entries", async () => {
    const deps = makeDeps();
    await seedInstallation(deps);
    const project = await deps.projects.create({
      name: "Web App",
      repoFullName: "acme/web",
      defaultBranch: "main",
      installationId: 99,
    });

    await deps.audit.record({
      projectId: project.id,
      actor: "barba",
      action: "test.action",
      subject: "subject",
      detail: { token: "ghp_abcdefghijklmnopqrstuvwxyz123456" },
    });

    const app = buildServer({ deps });
    const response = await app.inject({
      method: "GET",
      url: `/audit?projectId=${project.id}`,
    });

    expect(response.statusCode).toBe(200);
    const entries = response.json().entries;
    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({ action: "test.action", actor: "barba" });
    expect(JSON.stringify(entries)).not.toContain("ghp_");
    await app.close();
  });

  it("requires a projectId", async () => {
    const app = buildServer({ deps: makeDeps() });
    const response = await app.inject({ method: "GET", url: "/audit" });
    expect(response.statusCode).toBe(400);
    await app.close();
  });
});
