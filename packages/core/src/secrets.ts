import { decryptSecret, encryptSecret } from "./crypto.js";

export interface SecretStore {
  put(id: string, plaintext: string): Promise<void>;
  get(id: string): Promise<string | null>;
  has(id: string): Promise<boolean>;
  delete(id: string): Promise<void>;
}

export class EncryptedMemorySecretStore implements SecretStore {
  private readonly values = new Map<string, string>();

  constructor(private readonly key: Buffer) {
    if (key.length !== 32) {
      throw new Error("secret store key must be 32 bytes");
    }
  }

  async put(id: string, plaintext: string): Promise<void> {
    this.values.set(id, encryptSecret(plaintext, this.key));
  }

  async get(id: string): Promise<string | null> {
    const envelope = this.values.get(id);
    return envelope ? decryptSecret(envelope, this.key) : null;
  }

  async has(id: string): Promise<boolean> {
    return this.values.has(id);
  }

  async delete(id: string): Promise<void> {
    this.values.delete(id);
  }

  snapshot(): Record<string, string> {
    return Object.fromEntries(this.values);
  }
}
