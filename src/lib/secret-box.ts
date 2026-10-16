import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "node:crypto";
import { requireEnv } from "@/lib/env";

function keyMaterial() {
  const secret = requireEnv(
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_SECRET is required to store connector credentials",
  );
  return scryptSync(secret, "flow-weaver-integrations-v1", 32);
}

export function encryptSecret(plain: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", keyMaterial(), iv);
  const encrypted = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("base64");
}

export function decryptSecret(payload: string): string {
  const buf = Buffer.from(payload, "base64");
  if (buf.length < 29) throw new Error("Invalid credential payload");
  const iv = buf.subarray(0, 12);
  const tag = buf.subarray(12, 28);
  const encrypted = buf.subarray(28);
  const decipher = createDecipheriv("aes-256-gcm", keyMaterial(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
}
