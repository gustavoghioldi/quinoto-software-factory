import { AesSecretCipher } from "@factory/core";
import { InMemoryGitHubInstallationRepository, InMemoryProjectRepository } from "@factory/db";
import type { ApiDependencies, GitHubService } from "../src/deps.js";

export const masterKey = Buffer.alloc(32, 1).toString("base64");

export function makeDeps(overrides: Partial<GitHubService> = {}): ApiDependencies {
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

  return {
    installations: new InMemoryGitHubInstallationRepository(),
    projects: new InMemoryProjectRepository(),
    cipher: new AesSecretCipher({ FACTORY_MASTER_KEY: masterKey }),
    github,
    manifest: {
      name: "Quinoto Software Factory",
      baseUrl: "https://factory.example.com",
    },
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
