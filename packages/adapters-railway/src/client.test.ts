import { describe, expect, it, vi } from "vitest";
import { createRailwayClient, RailwayApiError } from "./client.js";
import { MockRailwayClient } from "./mock.js";

describe("MockRailwayClient", () => {
  it("creates, lists and deletes runners", async () => {
    const client = new MockRailwayClient();
    const runner = await client.createRunner({
      projectId: "p1",
      sessionId: "s1",
      image: "runner:latest",
      env: {},
      maxMinutes: 30,
    });
    expect(runner.status).toBe("healthy");
    expect(await client.listRunners()).toHaveLength(1);
    await client.deleteRunner(runner.serviceId);
    expect(await client.listRunners()).toHaveLength(0);
  });
});

describe("createRailwayClient", () => {
  it("creates a runner through the GraphQL API", async () => {
    const fetchImpl = vi.fn(
      async () =>
        new Response(JSON.stringify({ data: { serviceCreate: { id: "svc-1" } } }), {
          status: 200,
        }),
    );
    const client = createRailwayClient({ token: "t", fetchImpl });

    const runner = await client.createRunner({
      projectId: "p1",
      sessionId: "s1",
      image: "runner:latest",
      env: { STAGE: "apply" },
      maxMinutes: 30,
    });

    expect(runner).toEqual({ serviceId: "svc-1", url: "", status: "provisioning" });
    expect(fetchImpl).toHaveBeenCalledOnce();
  });

  it("maps a healthy deployment", async () => {
    const fetchImpl = vi.fn(
      async () =>
        new Response(
          JSON.stringify({
            data: {
              service: {
                id: "svc-1",
                serviceInstances: {
                  edges: [
                    { node: { latestDeployment: { status: "SUCCESS", url: "https://runner" } } },
                  ],
                },
              },
            },
          }),
          { status: 200 },
        ),
    );
    const client = createRailwayClient({ token: "t", fetchImpl });
    await expect(client.getRunner("svc-1")).resolves.toEqual({
      serviceId: "svc-1",
      url: "https://runner",
      status: "healthy",
    });
  });

  it("throws a typed error on GraphQL errors", async () => {
    const fetchImpl = vi.fn(
      async () =>
        new Response(JSON.stringify({ errors: [{ message: "not authorized" }] }), { status: 200 }),
    );
    const client = createRailwayClient({ token: "t", fetchImpl });
    await expect(
      client.createRunner({
        projectId: "p1",
        sessionId: "s1",
        image: "runner:latest",
        env: {},
        maxMinutes: 30,
      }),
    ).rejects.toBeInstanceOf(RailwayApiError);
  });
});
