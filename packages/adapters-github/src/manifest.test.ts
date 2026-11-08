import { describe, expect, it, vi } from "vitest";
import { GitHubApiError } from "./errors.js";
import { buildGitHubAppManifest, exchangeManifestCode } from "./manifest.js";

describe("buildGitHubAppManifest", () => {
  it("builds a self-hosted manifest with minimal permissions", () => {
    const manifest = buildGitHubAppManifest({
      name: "Quinoto Software Factory",
      baseUrl: "https://factory.example.com/",
    });

    expect(manifest.name).toBe("Quinoto Software Factory");
    expect(manifest.url).toBe("https://factory.example.com");
    expect(manifest.redirect_url).toBe("https://factory.example.com/github/manifest/callback");
    expect(manifest.hook_attributes).toEqual({
      url: "https://factory.example.com/webhooks/github",
      active: true,
    });
    expect(manifest.default_permissions).toEqual({
      contents: "write",
      pull_requests: "write",
      metadata: "read",
    });
    expect(manifest.public).toBe(false);
  });

  it("uses the provided homepage URL", () => {
    const manifest = buildGitHubAppManifest({
      name: "Factory",
      baseUrl: "https://factory.example.com",
      homepageUrl: "https://quinoto.tech",
    });
    expect(manifest.url).toBe("https://quinoto.tech");
  });
});

describe("exchangeManifestCode", () => {
  it("maps the conversion response", async () => {
    const fetchImpl = vi.fn(
      async () =>
        new Response(
          JSON.stringify({
            id: 123,
            slug: "quinoto-factory",
            client_id: "client-id",
            client_secret: "client-secret",
            pem: "-----BEGIN RSA PRIVATE KEY-----",
            webhook_secret: "webhook-secret",
            html_url: "https://github.com/apps/quinoto-factory",
          }),
          { status: 201 },
        ),
    );

    await expect(exchangeManifestCode({ code: "abc", fetchImpl })).resolves.toMatchObject({
      appId: "123",
      slug: "quinoto-factory",
      clientId: "client-id",
      privateKeyPem: "-----BEGIN RSA PRIVATE KEY-----",
      webhookSecret: "webhook-secret",
    });
  });

  it("throws a typed error when the exchange fails", async () => {
    const fetchImpl = vi.fn(async () => new Response("nope", { status: 404 }));
    await expect(exchangeManifestCode({ code: "abc", fetchImpl })).rejects.toBeInstanceOf(
      GitHubApiError,
    );
  });
});
