import { describe, expect, it } from "vitest";
import { buildServer } from "../src/server.js";
import { makeDeps, seedInstallation } from "./helpers.js";

describe("github webhooks", () => {
  it("accepts a valid signature", async () => {
    const app = buildServer({ deps: makeDeps() });
    const response = await app.inject({
      method: "POST",
      url: "/webhooks/github",
      headers: {
        "x-hub-signature-256": "sha256=valid",
        "x-github-event": "ping",
      },
      payload: { zen: "hello" },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status: "accepted" });
    await app.close();
  });

  it("rejects an invalid signature with 401", async () => {
    const app = buildServer({ deps: makeDeps() });
    const response = await app.inject({
      method: "POST",
      url: "/webhooks/github",
      headers: {
        "x-hub-signature-256": "sha256=invalid",
        "x-github-event": "ping",
      },
      payload: { zen: "hello" },
    });

    expect(response.statusCode).toBe(401);
    await app.close();
  });

  it("stores the installation id from an installation event", async () => {
    const deps = makeDeps();
    await seedInstallation(deps);
    await deps.installations.updateInstallation(
      (await deps.installations.findLatest())!.id,
      1,
      "old",
    );
    const app = buildServer({ deps });

    const response = await app.inject({
      method: "POST",
      url: "/webhooks/github",
      headers: {
        "x-hub-signature-256": "sha256=valid",
        "x-github-event": "installation",
      },
      payload: {
        action: "created",
        installation: { id: 42, account: { login: "acme" } },
      },
    });

    expect(response.statusCode).toBe(200);
    const latest = await deps.installations.findLatest();
    expect(latest?.installationId).toBe(42);
    expect(latest?.accountLogin).toBe("acme");
    await app.close();
  });
});
