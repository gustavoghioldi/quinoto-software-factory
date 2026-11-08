import { GitHubApiError } from "./errors.js";
import { createAppJwt } from "./jwt.js";

export interface InstallationTokenProviderOptions {
  appId: string;
  privateKey: string;
  fetchImpl?: typeof fetch;
  apiBaseUrl?: string;
  now?: () => number;
}

export interface InstallationTokenProvider {
  getToken(installationId: number): Promise<string>;
  invalidate(installationId: number): void;
}

interface CachedToken {
  token: string;
  expiresAt: number;
}

const EXPIRY_SKEW_MS = 60_000;

export function createInstallationTokenProvider(
  options: InstallationTokenProviderOptions,
): InstallationTokenProvider {
  const fetchImpl = options.fetchImpl ?? fetch;
  const apiBaseUrl = options.apiBaseUrl ?? "https://api.github.com";
  const now = options.now ?? Date.now;
  const cache = new Map<number, CachedToken>();

  return {
    async getToken(installationId: number): Promise<string> {
      const cached = cache.get(installationId);
      if (cached && cached.expiresAt - now() > EXPIRY_SKEW_MS) {
        return cached.token;
      }

      const jwt = createAppJwt(options.appId, options.privateKey, now());
      const response = await fetchImpl(
        `${apiBaseUrl}/app/installations/${installationId}/access_tokens`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${jwt}`,
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
          },
        },
      );

      if (!response.ok) {
        throw new GitHubApiError(response.status, "failed to create installation token");
      }

      const body = (await response.json()) as { token?: string; expires_at?: string };
      if (!body.token || !body.expires_at) {
        throw new GitHubApiError(response.status, "invalid installation token response");
      }

      cache.set(installationId, {
        token: body.token,
        expiresAt: Date.parse(body.expires_at),
      });
      return body.token;
    },

    invalidate(installationId: number): void {
      cache.delete(installationId);
    },
  };
}
