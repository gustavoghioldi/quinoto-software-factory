import type { AppConfig } from "./config.js";
import { decryptSecret, encryptSecret, requireMasterKey } from "./crypto.js";

export interface SecretCipher {
  encrypt(plaintext: string): Promise<string>;
  decrypt(envelope: string): Promise<string>;
}

export class AesSecretCipher implements SecretCipher {
  private readonly key: Buffer;

  constructor(config: Pick<AppConfig, "FACTORY_MASTER_KEY">) {
    this.key = requireMasterKey(config);
  }

  async encrypt(plaintext: string): Promise<string> {
    return encryptSecret(plaintext, this.key);
  }

  async decrypt(envelope: string): Promise<string> {
    return decryptSecret(envelope, this.key);
  }
}
