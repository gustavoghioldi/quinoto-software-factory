import { generateKeyPairSync } from "node:crypto";
import { describe, expect, it, vi } from "vitest";
import { GitHubApiError } from "./errors.js";
import { createInstallationTokenProvider } from "./tokens.js";

const { privateKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
const privatePem = privateKey.export({ type: "pkcs8", format: "pem" }).toString();

describe("createInstallationTokenProvider", () => {
  it("fetches and caches an installation token", async () => {
    const fetchImpl = vi.fn(
      async () =>
        new Response(
          JSON.stringify({
            token: "ghs_123",
            expires_at: new Date(Date.now() + 3_600_000).toISOString(),
          }),
          { status: 201 },
        ),
    );

    const provider = createInstallationTokenProvider({
      appId: "1",
      privateKey: privatePem,
      fetchImpl,
    });

    await expect(provider.getToken(42)).resolves.toBe("ghs_123");
    await expect(provider.getToken(42)).resolves.toBe("ghs_123");
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("throws a typed error when GitHub rejects the request", async () => {
    const fetchImpl = vi.fn(async () => new Response("nope", { status: 403 }));
    const provider = createInstallationTokenProvider({
      appId: "1",
      privateKey: privatePem,
      fetchImpl,
    });

    await expect(provider.getToken(7)).rejects.toBeInstanceOf(GitHubApiError);
  });
});
