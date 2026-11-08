import { describe, expect, it } from "vitest";
import { redactSecrets, redactValue } from "./redaction.js";

describe("redaction", () => {
  it("redacts GitHub tokens", () => {
    const value = "token=ghp_abcdefghijklmnopqrstuvwxyz123456";
    expect(redactSecrets(value)).toBe("token=[REDACTED]");
  });

  it("redacts bearer tokens", () => {
    expect(redactSecrets("Authorization: Bearer abc.def.ghi")).toBe(
      "Authorization: Bearer [REDACTED]",
    );
  });

  it("redacts nested objects", () => {
    const redacted = redactValue({
      headers: { authorization: "Bearer ghp_abcdefghijklmnopqrstuvwxyz123456" },
      ok: true,
    }) as { headers: { authorization: string }; ok: boolean };
    expect(redacted.headers.authorization).toContain("[REDACTED]");
    expect(redacted.ok).toBe(true);
  });

  it("leaves normal text untouched", () => {
    expect(redactSecrets("hello world")).toBe("hello world");
  });
});
