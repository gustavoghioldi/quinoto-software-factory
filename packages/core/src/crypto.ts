import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import type { AppConfig } from "./config.js";

const ALGORITHM = "aes-256-gcm";
const VERSION = "v1";
const NONCE_BYTES = 12;
const KEY_BYTES = 32;
const TAG_BYTES = 16;
const BASE64_KEY_PATTERN = /^[A-Za-z0-9+/]{43}=$/;

export class CryptoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CryptoError";
  }
}

export function parseMasterKey(value: string): Buffer {
  if (!BASE64_KEY_PATTERN.test(value)) {
    throw new CryptoError("FACTORY_MASTER_KEY must be 32 bytes encoded as base64");
  }
  const key = Buffer.from(value, "base64");
  if (key.length !== KEY_BYTES) {
    throw new CryptoError("FACTORY_MASTER_KEY must decode to 32 bytes");
  }
  return key;
}

export function requireMasterKey(config: Pick<AppConfig, "FACTORY_MASTER_KEY">): Buffer {
  if (!config.FACTORY_MASTER_KEY) {
    throw new CryptoError("FACTORY_MASTER_KEY is required to store integration secrets");
  }
  return parseMasterKey(config.FACTORY_MASTER_KEY);
}

export function encryptSecret(plaintext: string, key: Buffer): string {
  if (key.length !== KEY_BYTES) {
    throw new CryptoError("encryption key must be 32 bytes");
  }
  const nonce = randomBytes(NONCE_BYTES);
  const cipher = createCipheriv(ALGORITHM, key, nonce);
  const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [
    VERSION,
    nonce.toString("base64url"),
    ciphertext.toString("base64url"),
    tag.toString("base64url"),
  ].join(".");
}

export function decryptSecret(envelope: string, key: Buffer): string {
  if (key.length !== KEY_BYTES) {
    throw new CryptoError("encryption key must be 32 bytes");
  }
  const parts = envelope.split(".");
  if (parts.length !== 4 || parts[0] !== VERSION) {
    throw new CryptoError("unsupported or malformed secret envelope");
  }
  const noncePart = parts[1];
  const ciphertextPart = parts[2];
  const tagPart = parts[3];
  if (!noncePart || !ciphertextPart || !tagPart) {
    throw new CryptoError("malformed secret envelope");
  }
  const nonce = Buffer.from(noncePart, "base64url");
  const ciphertext = Buffer.from(ciphertextPart, "base64url");
  const tag = Buffer.from(tagPart, "base64url");
  if (nonce.length !== NONCE_BYTES || tag.length !== TAG_BYTES) {
    throw new CryptoError("malformed secret envelope");
  }
  try {
    const decipher = createDecipheriv(ALGORITHM, key, nonce);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("utf8");
  } catch {
    throw new CryptoError("secret authentication failed");
  }
}
