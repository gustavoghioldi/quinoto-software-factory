import { GitHubApiError } from "./errors.js";

export interface GitHubAppManifest {
  name: string;
  url: string;
  hook_attributes: {
    url: string;
    active: boolean;
  };
  redirect_url: string;
  callback_urls: string[];
  public: boolean;
  default_permissions: Record<string, "read" | "write" | "admin">;
  default_events: string[];
}

export interface GitHubManifestOptions {
  name: string;
  baseUrl: string;
  homepageUrl?: string;
}

export interface ManifestCredentials {
  appId: string;
  slug: string;
  clientId: string;
  clientSecret: string;
  privateKeyPem: string;
  webhookSecret: string;
  htmlUrl: string;
}

export interface ExchangeManifestCodeOptions {
  code: string;
  fetchImpl?: typeof fetch;
  apiBaseUrl?: string;
}

interface RawManifestConversion {
  id?: number;
  slug?: string;
  client_id?: string;
  client_secret?: string;
  pem?: string;
  webhook_secret?: string;
  html_url?: string;
}

export function buildGitHubAppManifest(options: GitHubManifestOptions): GitHubAppManifest {
  const base = options.baseUrl.replace(/\/+$/, "");
  return {
    name: options.name,
    url: options.homepageUrl ?? base,
    hook_attributes: {
      url: `${base}/webhooks/github`,
      active: true,
    },
    redirect_url: `${base}/github/manifest/callback`,
    callback_urls: [`${base}/github/callback`],
    public: false,
    default_permissions: {
      contents: "write",
      pull_requests: "write",
      metadata: "read",
    },
    default_events: ["installation", "installation_repositories", "pull_request"],
  };
}

export async function exchangeManifestCode(
  options: ExchangeManifestCodeOptions,
): Promise<ManifestCredentials> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const apiBaseUrl = options.apiBaseUrl ?? "https://api.github.com";
  const response = await fetchImpl(
    `${apiBaseUrl}/app-manifests/${encodeURIComponent(options.code)}/conversions`,
    {
      method: "POST",
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    },
  );

  if (!response.ok) {
    throw new GitHubApiError(response.status, "failed to exchange manifest code");
  }

  const body = (await response.json()) as RawManifestConversion;
  if (!body.id || !body.slug || !body.pem || !body.webhook_secret) {
    throw new GitHubApiError(response.status, "invalid manifest conversion response");
  }

  return {
    appId: String(body.id),
    slug: body.slug,
    clientId: body.client_id ?? "",
    clientSecret: body.client_secret ?? "",
    privateKeyPem: body.pem,
    webhookSecret: body.webhook_secret,
    htmlUrl: body.html_url ?? "",
  };
}
