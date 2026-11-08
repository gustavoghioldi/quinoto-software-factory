import { createVerify, generateKeyPairSync } from "node:crypto";
import { describe, expect, it } from "vitest";
import { createAppJwt } from "./jwt.js";

describe("createAppJwt", () => {
  it("creates a verifiable RS256 JWT with the expected claims", () => {
    const { privateKey, publicKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
    const privatePem = privateKey.export({ type: "pkcs8", format: "pem" }).toString();
    const jwt = createAppJwt("123456", privatePem, 1_700_000_000_000);

    const [header, payload, signature] = jwt.split(".");
    expect(header).toBeDefined();
    expect(payload).toBeDefined();
    expect(signature).toBeDefined();

    const verifier = createVerify("RSA-SHA256");
    verifier.update(`${header}.${payload}`);
    verifier.end();
    expect(verifier.verify(publicKey, Buffer.from(signature ?? "", "base64url"))).toBe(true);

    const decoded = JSON.parse(Buffer.from(payload ?? "", "base64url").toString("utf8")) as {
      iss: string;
      iat: number;
      exp: number;
    };
    expect(decoded.iss).toBe("123456");
    expect(decoded.exp - decoded.iat).toBe(600);
  });
});
