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

describe("Railway deployments", () => {
  it("triggers a deployment through the GraphQL API", async () => {
    const fetchImpl = vi.fn(
      async () =>
        new Response(
          JSON.stringify({ data: { deploymentCreate: { id: "dep-1", status: "BUILDING" } } }),
          { status: 200 },
        ),
    );
    const client = createRailwayClient({ token: "t", fetchImpl });

    await expect(
      client.triggerDeploy({
        railwayProjectId: "p1",
        serviceId: "s1",
        environmentId: "e1",
      }),
    ).resolves.toEqual({ id: "dep-1", status: "building", url: null });
  });

  it("maps a successful deployment", async () => {
    const fetchImpl = vi.fn(
      async () =>
        new Response(
          JSON.stringify({
            data: {
              deployment: { id: "dep-1", status: "SUCCESS", url: "https://app.up.railway.app" },
            },
          }),
          { status: 200 },
        ),
    );
    const client = createRailwayClient({ token: "t", fetchImpl });

    await expect(client.getDeployment("dep-1")).resolves.toEqual({
      id: "dep-1",
      status: "success",
      url: "https://app.up.railway.app",
    });
  });

  it("mock supports the deployment lifecycle", async () => {
    const client = new MockRailwayClient();
    const deployment = await client.triggerDeploy({
      railwayProjectId: "p1",
      serviceId: "s1",
      environmentId: "e1",
    });
    expect(deployment.status).toBe("building");
    await expect(client.getDeployment(deployment.id)).resolves.toEqual(deployment);
  });
});
