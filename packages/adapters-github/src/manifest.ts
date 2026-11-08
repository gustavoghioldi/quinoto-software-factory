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
