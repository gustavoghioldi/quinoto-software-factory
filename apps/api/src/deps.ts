import type {
  GitHubRepository,
  InstallationTokenProvider,
  ManifestCredentials,
  PullRequestResult,
} from "@factory/adapters-github";
import type { SecretCipher } from "@factory/core";
import type {
  GitHubInstallationRepository,
  ProjectRepository,
  RailwayLinkRepository,
} from "@factory/db";
import type { RailwayClient } from "@factory/adapters-railway";
import type { AgentRuntime } from "./services/agent-runtime.js";
import type { WorkflowService } from "./services/workflow-service.js";

export interface GitHubService {
  exchangeManifestCode(code: string): Promise<ManifestCredentials>;
  getInstallationToken(installationId: number): Promise<string>;
  listRepositories(token: string): Promise<GitHubRepository[]>;
  openPullRequest(input: {
    token: string;
    owner: string;
    repo: string;
    head: string;
    base: string;
    title: string;
    body: string;
  }): Promise<PullRequestResult>;
  verifyWebhook(payload: string, signature: string | undefined): Promise<boolean>;
}

export interface ApiDependencies {
  installations: GitHubInstallationRepository;
  projects: ProjectRepository;
  railwayLinks: RailwayLinkRepository;
  railway: RailwayClient;
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
