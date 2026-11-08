export interface RunnerSpec {
  projectId: string;
  sessionId: string;
  image: string;
  env: Record<string, string>;
  maxMinutes: number;
}

export type RunnerStatus = "provisioning" | "healthy" | "failed" | "terminated";

export interface Runner {
  serviceId: string;
  url: string;
  status: RunnerStatus;
}

export interface RailwayClient {
  createRunner(spec: RunnerSpec): Promise<Runner>;
  getRunner(serviceId: string): Promise<Runner | null>;
  deleteRunner(serviceId: string): Promise<void>;
  listRunners(): Promise<Runner[]>;
  getLogs(serviceId: string): Promise<string[]>;
  triggerDeploy(spec: DeploySpec): Promise<Deployment>;
  getDeployment(deploymentId: string): Promise<Deployment | null>;
  getDeploymentLogs(deploymentId: string): Promise<string[]>;
}

export interface DeploySpec {
  railwayProjectId: string;
  serviceId: string;
  environmentId: string;
}

export type DeploymentStatus = "building" | "success" | "failed" | "unknown";

export interface Deployment {
  id: string;
  status: DeploymentStatus;
  url: string | null;
}
