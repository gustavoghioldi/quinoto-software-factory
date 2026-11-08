import { GitHubApiError } from "./errors.js";

export interface GitHubRepositoryPermissions {
  push: boolean;
  pull: boolean;
  admin: boolean;
}

export interface GitHubRepository {
  id: number;
  fullName: string;
  defaultBranch: string;
  private: boolean;
  permissions?: GitHubRepositoryPermissions;
}

interface RawRepository {
  id: number;
  full_name: string;
  default_branch: string;
  private: boolean;
  permissions?: GitHubRepositoryPermissions;
}

export interface ListRepositoriesOptions {
  token: string;
  fetchImpl?: typeof fetch;
  apiBaseUrl?: string;
}

export async function listInstallationRepositories(
  options: ListRepositoriesOptions,
): Promise<GitHubRepository[]> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const apiBaseUrl = options.apiBaseUrl ?? "https://api.github.com";

  const response = await fetchImpl(`${apiBaseUrl}/installation/repositories?per_page=100`, {
    headers: {
      Authorization: `Bearer ${options.token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (!response.ok) {
    throw new GitHubApiError(response.status, "failed to list installation repositories");
  }

  const body = (await response.json()) as { repositories?: RawRepository[] };
  return (body.repositories ?? []).map((repository) => ({
    id: repository.id,
    fullName: repository.full_name,
    defaultBranch: repository.default_branch,
    private: repository.private,
    permissions: repository.permissions,
  }));
}
