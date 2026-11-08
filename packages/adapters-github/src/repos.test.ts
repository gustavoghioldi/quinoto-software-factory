import { describe, expect, it, vi } from "vitest";
import { GitHubApiError } from "./errors.js";
import { listInstallationRepositories } from "./repos.js";

describe("listInstallationRepositories", () => {
  it("maps repositories from the GitHub payload", async () => {
    const fetchImpl = vi.fn(
      async () =>
        new Response(
          JSON.stringify({
            repositories: [
              {
                id: 1,
                full_name: "acme/web",
                default_branch: "main",
                private: true,
                permissions: { push: true, pull: true, admin: false },
              },
            ],
          }),
          { status: 200 },
        ),
    );

    await expect(listInstallationRepositories({ token: "t", fetchImpl })).resolves.toEqual([
      {
        id: 1,
        fullName: "acme/web",
        defaultBranch: "main",
        private: true,
        permissions: { push: true, pull: true, admin: false },
      },
    ]);
  });

  it("throws a typed error on a failed request", async () => {
    const fetchImpl = vi.fn(async () => new Response("forbidden", { status: 403 }));
    await expect(listInstallationRepositories({ token: "t", fetchImpl })).rejects.toBeInstanceOf(
      GitHubApiError,
    );
  });
});
