import type {
  GitHubRepository,
  InstallationTokenProvider,
  ManifestCredentials,
} from "@factory/adapters-github";
import type { SecretCipher } from "@factory/core";
import type { GitHubInstallationRepository, ProjectRepository } from "@factory/db";
import type { AgentRuntime } from "./services/agent-runtime.js";
import type { WorkflowService } from "./services/workflow-service.js";

export interface GitHubService {
  exchangeManifestCode(code: string): Promise<ManifestCredentials>;
  getInstallationToken(installationId: number): Promise<string>;
  listRepositories(token: string): Promise<GitHubRepository[]>;
  verifyWebhook(payload: string, signature: string | undefined): Promise<boolean>;
}

export interface ApiDependencies {
  installations: GitHubInstallationRepository;
  projects: ProjectRepository;
  cipher: SecretCipher;
  github: GitHubService;
  workflows: WorkflowService;
  agentRuntime: AgentRuntime;
  manifest: {
    name: string;
    baseUrl: string;
  };
  tokenProvider?: InstallationTokenProvider;
}
