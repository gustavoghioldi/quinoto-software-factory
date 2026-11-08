import { randomBytes } from "node:crypto";
import { describe, expect, it } from "vitest";
import { EncryptedMemorySecretStore } from "./secrets.js";

const key = randomBytes(32);

describe("EncryptedMemorySecretStore", () => {
  it("roundtrips a secret", async () => {
    const store = new EncryptedMemorySecretStore(key);
    await store.put("github/1", "ghs_token");
    await expect(store.get("github/1")).resolves.toBe("ghs_token");
  });

  it("never stores plaintext", async () => {
    const store = new EncryptedMemorySecretStore(key);
    await store.put("github/1", "ghs_token");
    expect(JSON.stringify(store.snapshot())).not.toContain("ghs_token");
  });

  it("returns null for an unknown id", async () => {
    const store = new EncryptedMemorySecretStore(key);
    await expect(store.get("missing")).resolves.toBeNull();
  });

  it("deletes a secret", async () => {
    const store = new EncryptedMemorySecretStore(key);
    await store.put("id", "value");
    await store.delete("id");
    await expect(store.has("id")).resolves.toBe(false);
  });
});
