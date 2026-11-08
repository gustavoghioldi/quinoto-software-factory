import type { DeploySpec, Deployment, RailwayClient, Runner, RunnerSpec } from "./types.js";

export class MockRailwayClient implements RailwayClient {
  private readonly runners = new Map<string, Runner>();
  private readonly deployments = new Map<string, Deployment>();
  private nextId = 1;
  private nextDeploymentId = 1;

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

  async triggerDeploy(_spec: DeploySpec): Promise<Deployment> {
    const id = `dep-${this.nextDeploymentId++}`;
    const deployment: Deployment = { id, status: "building", url: null };
    this.deployments.set(id, deployment);
    return deployment;
  }

  async getDeployment(deploymentId: string): Promise<Deployment | null> {
    return this.deployments.get(deploymentId) ?? null;
  }

  async getDeploymentLogs(): Promise<string[]> {
    return [];
  }
}
