import { MockRailwayClient } from "@factory/adapters-railway";
import { describe, expect, it } from "vitest";
import { createAgentRuntime, SessionError } from "../src/services/agent-runtime.js";

describe("agent runtime", () => {
  it("starts a session and provisions a runner", async () => {
    const railway = new MockRailwayClient();
    const runtime = createAgentRuntime({ railway });
    const session = await runtime.start({
      projectId: "p1",
      stage: "apply",
      prompt: "implement the task",
    });

    expect(session.status).toBe("running");
    expect(session.runnerServiceId).toBe("svc-1");
    expect(await railway.listRunners()).toHaveLength(1);
  });

  it("cancels a session and destroys the runner", async () => {
    const railway = new MockRailwayClient();
    const runtime = createAgentRuntime({ railway });
    const session = await runtime.start({ projectId: "p1", stage: "apply", prompt: "x" });

    const cancelled = await runtime.cancel(session.id);
    expect(cancelled.status).toBe("cancelled");
    expect(cancelled.endedAt).not.toBeNull();
    expect(await railway.listRunners()).toHaveLength(0);
  });

  it("rejects cancelling an unknown session", async () => {
    const runtime = createAgentRuntime({ railway: new MockRailwayClient() });
    await expect(runtime.cancel("missing")).rejects.toBeInstanceOf(SessionError);
  });

  it("stores events in order", async () => {
    const runtime = createAgentRuntime({ railway: new MockRailwayClient() });
    const session = await runtime.start({ projectId: "p1", stage: "apply", prompt: "x" });

    await runtime.appendEvent(session.id, "message", { text: "hola" });
    await runtime.appendEvent(session.id, "tool", { name: "edit" });

    const events = await runtime.events(session.id);
    expect(events.map((event) => event.id)).toEqual([1, 2]);
    expect(events[0]?.payload).toEqual({ text: "hola" });
  });

  it("times out sessions past their limit", async () => {
    const railway = new MockRailwayClient();
    let current = new Date("2026-01-01T00:00:00Z");
    const runtime = createAgentRuntime({ railway, now: () => current });
    const session = await runtime.start({
      projectId: "p1",
      stage: "apply",
      prompt: "x",
      maxMinutes: 10,
    });

    current = new Date("2026-01-01T00:11:00Z");
    await expect(runtime.reconcileTimeouts(current)).resolves.toEqual([session.id]);
    const updated = await runtime.get(session.id);
    expect(updated?.status).toBe("timed_out");
    expect(await railway.listRunners()).toHaveLength(0);
  });

  it("destroys orphan runners without an active session", async () => {
    const railway = new MockRailwayClient();
    const runtime = createAgentRuntime({ railway });
    await runtime.start({ projectId: "p1", stage: "apply", prompt: "x" });
    const orphan = await railway.createRunner({
      projectId: "p1",
      sessionId: "orphan",
      image: "runner:latest",
      env: {},
      maxMinutes: 30,
    });

    await expect(runtime.reconcileOrphans()).resolves.toEqual([orphan.serviceId]);
    expect(await railway.listRunners()).toHaveLength(1);
  });
});
