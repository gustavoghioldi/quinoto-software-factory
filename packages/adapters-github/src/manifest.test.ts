import { describe, expect, it } from "vitest";
import { buildGitHubAppManifest } from "./manifest.js";

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
