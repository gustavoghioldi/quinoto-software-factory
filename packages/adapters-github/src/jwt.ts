import { createSign } from "node:crypto";

function base64url(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

export function createAppJwt(appId: string, privateKey: string, nowMs = Date.now()): string {
  const iat = Math.floor(nowMs / 1000) - 60;
  const exp = iat + 600;
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64url(JSON.stringify({ iat, exp, iss: appId }));
  const data = `${header}.${payload}`;

  const signer = createSign("RSA-SHA256");
  signer.update(data);
  signer.end();
  const signature = signer.sign(privateKey).toString("base64url");

  return `${data}.${signature}`;
}
