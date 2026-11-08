import { randomBytes } from "node:crypto";
import {
  createInstallationTokenProvider,
  exchangeManifestCode,
  listInstallationRepositories,
  verifyWebhookSignature,
} from "@factory/adapters-github";
import { AesSecretCipher, ConfigError, type AppConfig, type SecretCipher } from "@factory/core";
import {
  createDatabase,
  InMemoryGitHubInstallationRepository,
  InMemoryProjectRepository,
  PostgresGitHubInstallationRepository,
  PostgresProjectRepository,
  type GitHubInstallationRepository,
  type ProjectRepository,
} from "@factory/db";
import type { ApiDependencies, GitHubService } from "./deps.js";

function resolveCipher(config: AppConfig): SecretCipher {
  if (config.FACTORY_MASTER_KEY) {
    return new AesSecretCipher(config);
  }
  if (config.NODE_ENV === "production") {
    throw new ConfigError(["FACTORY_MASTER_KEY: is required in production"]);
  }
  console.warn(
    "[api] FACTORY_MASTER_KEY not set; using an ephemeral key. Secrets will be lost on restart.",
  );
  return new AesSecretCipher({ FACTORY_MASTER_KEY: randomBytes(32).toString("base64") });
}

export async function createDependencies(config: AppConfig): Promise<ApiDependencies> {
  const cipher = resolveCipher(config);

  let installations: GitHubInstallationRepository;
  let projects: ProjectRepository;

  if (config.DATABASE_URL) {
    const { db } = createDatabase(config.DATABASE_URL);
    installations = new PostgresGitHubInstallationRepository(db);
    projects = new PostgresProjectRepository(db);
  } else {
    installations = new InMemoryGitHubInstallationRepository();
    projects = new InMemoryProjectRepository();
  }

  const providerCache = new Map<string, ReturnType<typeof createInstallationTokenProvider>>();

  async function providerForLatest() {
    const latest = await installations.findLatest();
    if (!latest) {
      throw new ConfigError(["github: app is not configured"]);
    }
    let provider = providerCache.get(latest.appId);
    if (!provider) {
      const privateKey = await cipher.decrypt(latest.privateKeyCiphertext);
      provider = createInstallationTokenProvider({ appId: latest.appId, privateKey });
      providerCache.set(latest.appId, provider);
    }
    return provider;
  }

  const github: GitHubService = {
    exchangeManifestCode: (code) => exchangeManifestCode({ code }),
    async getInstallationToken(installationId: number): Promise<string> {
      const provider = await providerForLatest();
      return provider.getToken(installationId);
    },
    listRepositories: (token: string) => listInstallationRepositories({ token }),
    async verifyWebhook(payload: string, signature: string | undefined): Promise<boolean> {
      const latest = await installations.findLatest();
      if (!latest) {
        return false;
      }
      const secret = await cipher.decrypt(latest.webhookSecretCiphertext);
      return verifyWebhookSignature(payload, signature, secret);
    },
  };

  return {
    installations,
    projects,
    cipher,
    github,
    manifest: {
      name: config.GITHUB_APP_NAME,
      baseUrl: config.FACTORY_BASE_URL,
    },
  };
}
