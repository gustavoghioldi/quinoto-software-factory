import { AesSecretCipher } from "@factory/core";
import {
  InMemoryApprovalRepository,
  InMemoryArtifactRepository,
  InMemoryGitHubInstallationRepository,
  InMemoryProjectRepository,
  InMemoryWorkflowRepository,
} from "@factory/db";
import type { ApiDependencies, GitHubService } from "../src/deps.js";
import { createWorkflowService } from "../src/services/workflow-service.js";

export const masterKey = Buffer.alloc(32, 1).toString("base64");

export interface TestDeps extends ApiDependencies {
  workflowRepository: InMemoryWorkflowRepository;
  artifactRepository: InMemoryArtifactRepository;
  approvalRepository: InMemoryApprovalRepository;
}

export function makeDeps(overrides: Partial<GitHubService> = {}): TestDeps {
  const github: GitHubService = {
    exchangeManifestCode: async () => ({
      appId: "123",
      slug: "quinoto-factory",
      clientId: "client-id",
      clientSecret: "client-secret",
      privateKeyPem: "-----BEGIN RSA PRIVATE KEY-----",
      webhookSecret: "webhook-secret",
      htmlUrl: "https://github.com/apps/quinoto-factory",
    }),
    getInstallationToken: async () => "ghs_token",
    listRepositories: async () => [
      { id: 1, fullName: "acme/web", defaultBranch: "main", private: true },
    ],
    verifyWebhook: async (_payload, signature) => signature === "sha256=valid",
    ...overrides,
  };

  const workflowRepository = new InMemoryWorkflowRepository();
  const artifactRepository = new InMemoryArtifactRepository();
  const approvalRepository = new InMemoryApprovalRepository();

  return {
    installations: new InMemoryGitHubInstallationRepository(),
    projects: new InMemoryProjectRepository(),
    cipher: new AesSecretCipher({ FACTORY_MASTER_KEY: masterKey }),
    github,
    workflows: createWorkflowService({
      workflows: workflowRepository,
      artifacts: artifactRepository,
      approvals: approvalRepository,
    }),
    manifest: {
      name: "Quinoto Software Factory",
      baseUrl: "https://factory.example.com",
    },
    workflowRepository,
    artifactRepository,
    approvalRepository,
  };
}

export async function seedInstallation(deps: ApiDependencies): Promise<void> {
  await deps.installations.save({
    appId: "123",
    slug: "quinoto-factory",
    clientId: "client-id",
    installationId: 99,
    accountLogin: "acme",
    privateKeyCiphertext: "encrypted-private-key",
    webhookSecretCiphertext: "encrypted-webhook-secret",
  });
}
