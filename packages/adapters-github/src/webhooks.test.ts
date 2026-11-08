import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { verifyWebhookSignature } from "./webhooks.js";

const secret = "webhook-secret";
const payload = JSON.stringify({ action: "opened" });
const signature = "sha256=" + createHmac("sha256", secret).update(payload).digest("hex");

describe("verifyWebhookSignature", () => {
  it("accepts a valid signature", () => {
    expect(verifyWebhookSignature(payload, signature, secret)).toBe(true);
  });

  it("rejects a tampered payload", () => {
    expect(verifyWebhookSignature(`${payload} `, signature, secret)).toBe(false);
  });

  it("rejects a missing signature", () => {
    expect(verifyWebhookSignature(payload, undefined, secret)).toBe(false);
  });

  it("rejects a malformed signature", () => {
    expect(verifyWebhookSignature(payload, "sha1=abc", secret)).toBe(false);
  });
});
