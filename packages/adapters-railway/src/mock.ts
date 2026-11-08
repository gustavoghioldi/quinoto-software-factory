import type { RailwayClient, Runner, RunnerSpec } from "./types.js";

export class MockRailwayClient implements RailwayClient {
  private readonly runners = new Map<string, Runner>();
  private nextId = 1;

  async createRunner(_spec: RunnerSpec): Promise<Runner> {
    const serviceId = `svc-${this.nextId++}`;
    const runner: Runner = {
      serviceId,
      url: `https://${serviceId}.up.railway.app`,
      status: "healthy",
    };
    this.runners.set(serviceId, runner);
    return runner;
  }

  async getRunner(serviceId: string): Promise<Runner | null> {
    return this.runners.get(serviceId) ?? null;
  }

  async deleteRunner(serviceId: string): Promise<void> {
    this.runners.delete(serviceId);
  }

  async listRunners(): Promise<Runner[]> {
    return [...this.runners.values()];
  }

  async getLogs(): Promise<string[]> {
    return [];
  }
}
