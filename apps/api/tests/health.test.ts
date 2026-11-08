import { describe, expect, it } from "vitest";
import { buildServer } from "../src/server.js";

describe("health endpoints", () => {
  it("returns ok on /healthz", async () => {
    const app = buildServer();
    const response = await app.inject({ method: "GET", url: "/healthz" });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status: "ok" });
    await app.close();
  });

  it("returns ok on /readyz when dependencies are healthy", async () => {
    const app = buildServer({ readiness: async () => ({ database: "ok", redis: "ok" }) });
    const response = await app.inject({ method: "GET", url: "/readyz" });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({ status: "ok" });
    await app.close();
  });

  it("returns 503 and names the failing dependency", async () => {
    const app = buildServer({ readiness: async () => ({ database: "ok", redis: "down" }) });
    const response = await app.inject({ method: "GET", url: "/readyz" });
    expect(response.statusCode).toBe(503);
    expect(response.json()).toMatchObject({ status: "unavailable", failing: ["redis"] });
    await app.close();
  });
});
