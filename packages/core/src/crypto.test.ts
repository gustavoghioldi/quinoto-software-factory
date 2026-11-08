import { randomBytes } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  CryptoError,
  decryptSecret,
  encryptSecret,
  parseMasterKey,
  requireMasterKey,
} from "./crypto.js";

const key = randomBytes(32);
const otherKey = randomBytes(32);

describe("crypto", () => {
  it("roundtrips a secret", () => {
    const envelope = encryptSecret("gho_super_secret", key);
    expect(envelope).not.toContain("gho_super_secret");
    expect(decryptSecret(envelope, key)).toBe("gho_super_secret");
  });

  it("uses a fresh nonce per encryption", () => {
    expect(encryptSecret("same", key)).not.toBe(encryptSecret("same", key));
  });

  it("fails with the wrong key", () => {
    const envelope = encryptSecret("secret", key);
    expect(() => decryptSecret(envelope, otherKey)).toThrow(CryptoError);
  });

  it("detects tampered ciphertext", () => {
    const envelope = encryptSecret("secret", key);
    const parts = envelope.split(".");
    const ciphertext = Buffer.from(parts[2] ?? "", "base64url");
    ciphertext[0] = (ciphertext[0] ?? 0) ^ 0xff;
    parts[2] = ciphertext.toString("base64url");
    expect(() => decryptSecret(parts.join("."), key)).toThrow(CryptoError);
  });

  it("rejects malformed envelopes", () => {
    expect(() => decryptSecret("not-an-envelope", key)).toThrow(CryptoError);
  });

  it("parses a valid base64 master key", () => {
    const encoded = key.toString("base64");
    expect(parseMasterKey(encoded)).toHaveLength(32);
  });

  it("rejects a master key with the wrong length", () => {
    expect(() => parseMasterKey(Buffer.alloc(16).toString("base64"))).toThrow(CryptoError);
  });

  it("requires a master key when asked", () => {
    expect(() => requireMasterKey({ FACTORY_MASTER_KEY: undefined } as never)).toThrow(CryptoError);
  });
});
