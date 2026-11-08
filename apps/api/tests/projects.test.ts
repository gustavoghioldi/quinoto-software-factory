import { describe, expect, it } from "vitest";
import { buildServer } from "../src/server.js";
import { makeDeps, seedInstallation } from "./helpers.js";

describe("project routes", () => {
  it("creates and lists projects", async () => {
    const deps = makeDeps();
    await seedInstallation(deps);
    const app = buildServer({ deps });

    const created = await app.inject({
      method: "POST",
      url: "/projects",
      payload: { name: "Web App", repoFullName: "acme/web", defaultBranch: "main" },
    });
    expect(created.statusCode).toBe(201);
    expect(created.json()).toMatchObject({
      name: "Web App",
      repoFullName: "acme/web",
      status: "ready",
    });

    const listed = await app.inject({ method: "GET", url: "/projects" });
    expect(listed.statusCode).toBe(200);
    expect(listed.json().projects).toHaveLength(1);
    await app.close();
  });

  it("rejects an invalid payload", async () => {
    const app = buildServer({ deps: makeDeps() });
    const response = await app.inject({ method: "POST", url: "/projects", payload: { name: "" } });

    expect(response.statusCode).toBe(400);
    await app.close();
  });

  it("returns 409 when GitHub is not installed", async () => {
    const app = buildServer({ deps: makeDeps() });
    const response = await app.inject({
      method: "POST",
      url: "/projects",
      payload: { name: "Web", repoFullName: "acme/web", defaultBranch: "main" },
    });

    expect(response.statusCode).toBe(409);
    await app.close();
  });
});
