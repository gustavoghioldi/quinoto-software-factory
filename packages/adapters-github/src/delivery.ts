import { GitHubApiError } from "./errors.js";

export class ProtectedBranchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProtectedBranchError";
  }
}

export interface OpenPullRequestInput {
  token: string;
  owner: string;
  repo: string;
  head: string;
  base: string;
  title: string;
  body: string;
  fetchImpl?: typeof fetch;
  apiBaseUrl?: string;
}

export interface PullRequestResult {
  number: number;
  url: string;
}

const PROTECTED_BRANCHES = new Set(["main", "master"]);

function headers(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
  };
}

async function findOpenPullRequest(
  input: OpenPullRequestInput,
  fetchImpl: typeof fetch,
  apiBaseUrl: string,
): Promise<PullRequestResult | null> {
  const response = await fetchImpl(
    `${apiBaseUrl}/repos/${input.owner}/${input.repo}/pulls?state=open&head=${encodeURIComponent(
      `${input.owner}:${input.head}`,
    )}`,
    { headers: headers(input.token) },
  );

  if (!response.ok) {
    return null;
  }

  const body = (await response.json()) as Array<{ number: number; html_url: string }>;
  const first = body[0];
  return first ? { number: first.number, url: first.html_url } : null;
}

export async function openPullRequest(input: OpenPullRequestInput): Promise<PullRequestResult> {
  if (PROTECTED_BRANCHES.has(input.head) || input.head === input.base) {
    throw new ProtectedBranchError(`refusing to open a pull request from ${input.head}`);
  }

  const fetchImpl = input.fetchImpl ?? fetch;
  const apiBaseUrl = input.apiBaseUrl ?? "https://api.github.com";

  const response = await fetchImpl(`${apiBaseUrl}/repos/${input.owner}/${input.repo}/pulls`, {
    method: "POST",
    headers: headers(input.token),
    body: JSON.stringify({
      title: input.title,
      head: input.head,
      base: input.base,
      body: input.body,
    }),
  });

  if (response.status === 422) {
    const existing = await findOpenPullRequest(input, fetchImpl, apiBaseUrl);
    if (existing) {
      return existing;
    }
  }

  if (!response.ok) {
    throw new GitHubApiError(response.status, "failed to open pull request");
  }

  const body = (await response.json()) as { number?: number; html_url?: string };
  if (!body.number || !body.html_url) {
    throw new GitHubApiError(response.status, "invalid pull request response");
  }

  return { number: body.number, url: body.html_url };
}
