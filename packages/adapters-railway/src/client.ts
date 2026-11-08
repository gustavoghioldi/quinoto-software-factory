import type {
  DeploySpec,
  Deployment,
  DeploymentStatus,
  RailwayClient,
  Runner,
  RunnerSpec,
  RunnerStatus,
} from "./types.js";

export class RailwayApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "RailwayApiError";
  }
}

export interface RailwayClientOptions {
  token: string;
  apiUrl?: string;
  fetchImpl?: typeof fetch;
}

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

function mapStatus(status: string | undefined): RunnerStatus {
  switch (status) {
    case "SUCCESS":
    case "RUNNING":
    case "ACTIVE":
      return "healthy";
    case "FAILED":
    case "CRASHED":
      return "failed";
    case "REMOVED":
    case "TERMINATED":
      return "terminated";
    default:
      return "provisioning";
  }
}

function mapDeploymentStatus(status: string | undefined): DeploymentStatus {
  switch (status) {
    case "SUCCESS":
      return "success";
    case "FAILED":
    case "CRASHED":
      return "failed";
    case "BUILDING":
    case "DEPLOYING":
    case "INITIALIZING":
      return "building";
    default:
      return "unknown";
  }
}

export function createRailwayClient(options: RailwayClientOptions): RailwayClient {
  const fetchImpl = options.fetchImpl ?? fetch;
  const apiUrl = options.apiUrl ?? "https://backboard.railway.com/graphql/v2";

  async function graphql<T>(query: string, variables: Record<string, unknown>): Promise<T> {
    const response = await fetchImpl(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${options.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      throw new RailwayApiError(response.status, "railway request failed");
    }

    const body = (await response.json()) as GraphQLResponse<T>;
    if (body.errors && body.errors.length > 0) {
      throw new RailwayApiError(400, body.errors.map((error) => error.message).join("; "));
    }
    if (!body.data) {
      throw new RailwayApiError(500, "railway returned no data");
    }
    return body.data;
  }

  return {
    async createRunner(spec: RunnerSpec): Promise<Runner> {
      const data = await graphql<{ serviceCreate: { id: string } }>(
        `
          mutation ServiceCreate($input: ServiceCreateInput!) {
            serviceCreate(input: $input) {
              id
            }
          }
        `,
        {
          input: {
            projectId: spec.projectId,
            name: `runner-${spec.sessionId}`,
            source: { image: spec.image },
            variables: spec.env,
          },
        },
      );
      return { serviceId: data.serviceCreate.id, url: "", status: "provisioning" };
    },

    async getRunner(serviceId: string): Promise<Runner | null> {
      const data = await graphql<{
        service: {
          id: string;
          serviceInstances: {
            edges: Array<{
              node: { latestDeployment: { status: string; url: string } | null };
            }>;
          };
        } | null;
      }>(
        `
          query Service($id: String!) {
            service(id: $id) {
              id
              serviceInstances {
                edges {
                  node {
                    latestDeployment {
                      status
                      url
                    }
                  }
                }
              }
            }
          }
        `,
        { id: serviceId },
      );

      if (!data.service) {
        return null;
      }
      const deployment = data.service.serviceInstances.edges[0]?.node.latestDeployment;
      return {
        serviceId,
        url: deployment?.url ?? "",
        status: mapStatus(deployment?.status),
      };
    },

    async deleteRunner(serviceId: string): Promise<void> {
      await graphql<{ serviceDelete: boolean }>(
        `
          mutation ServiceDelete($id: String!) {
            serviceDelete(id: $id)
          }
        `,
        { id: serviceId },
      );
    },

    async listRunners(): Promise<Runner[]> {
      // Railway no expone un listado global simple; la reconciliación se hace por sesión.
      return [];
    },

    async getLogs(): Promise<string[]> {
      return [];
    },

    async triggerDeploy(spec: DeploySpec): Promise<Deployment> {
      const data = await graphql<{ deploymentCreate: { id: string; status: string } }>(
        `
          mutation DeploymentCreate($input: DeploymentCreateInput!) {
            deploymentCreate(input: $input) {
              id
              status
            }
          }
        `,
        {
          input: {
            projectId: spec.railwayProjectId,
            serviceId: spec.serviceId,
            environmentId: spec.environmentId,
          },
        },
      );
      return {
        id: data.deploymentCreate.id,
        status: mapDeploymentStatus(data.deploymentCreate.status),
        url: null,
      };
    },

    async getDeployment(deploymentId: string): Promise<Deployment | null> {
      const data = await graphql<{
        deployment: { id: string; status: string; url: string | null } | null;
      }>(
        `
          query Deployment($id: String!) {
            deployment(id: $id) {
              id
              status
              url
            }
          }
        `,
        { id: deploymentId },
      );
      if (!data.deployment) {
        return null;
      }
      return {
        id: data.deployment.id,
        status: mapDeploymentStatus(data.deployment.status),
        url: data.deployment.url,
      };
    },

    async getDeploymentLogs(): Promise<string[]> {
      return [];
    },
  };
}
