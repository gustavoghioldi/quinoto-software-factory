import { describe, expect, it } from "vitest";
import { buildServer } from "../src/server.js";
import { makeDeps, seedInstallation } from "./helpers.js";

describe("github routes", () => {
  it("returns the app manifest", async () => {
    const app = buildServer({ deps: makeDeps() });
    const response = await app.inject({ method: "GET", url: "/github/manifest" });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      name: "Quinoto Software Factory",
      redirect_url: "https://factory.example.com/github/manifest/callback",
    });
    await app.close();
  });

  it("stores credentials encrypted and redirects to the installation page", async () => {
    const deps = makeDeps();
    const app = buildServer({ deps });
    const response = await app.inject({
      method: "GET",
      url: "/github/manifest/callback?code=abc",
    });

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe(
      "https://github.com/apps/quinoto-factory/installations/new",
    );

    const saved = await deps.installations.findLatest();
    expect(saved?.privateKeyCiphertext).not.toContain("BEGIN RSA PRIVATE KEY");
    expect(saved?.webhookSecretCiphertext).not.toContain("webhook-secret");
    await app.close();
  });

  it("lists repositories when the app is installed", async () => {
    const deps = makeDeps();
    await seedInstallation(deps);
    const app = buildServer({ deps });
    const response = await app.inject({ method: "GET", url: "/github/repos" });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      repositories: [{ id: 1, fullName: "acme/web", defaultBranch: "main", private: true }],
    });
    await app.close();
  });

  it("returns 409 when the app is not installed", async () => {
    const app = buildServer({ deps: makeDeps() });
    const response = await app.inject({ method: "GET", url: "/github/repos" });

    expect(response.statusCode).toBe(409);
    await app.close();
  });
});
