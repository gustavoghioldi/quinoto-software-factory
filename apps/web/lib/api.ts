import type { Project, Repository } from "./types";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiUrl}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: string };
    throw new ApiError(response.status, body.error ?? `HTTP ${response.status}`);
  }

  return (await response.json()) as T;
}

export const api = {
  listProjects: () => request<{ projects: Project[] }>("/projects"),
  listRepositories: () => request<{ repositories: Repository[] }>("/github/repos"),
  createProject: (input: { name: string; repoFullName: string; defaultBranch: string }) =>
    request<Project>("/projects", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  getManifest: () => request<Record<string, unknown>>("/github/manifest"),
};
