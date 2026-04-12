import { Scrypt } from "oslo/password";

const scrypt = new Scrypt();

export async function hashString(payload: string): Promise<string> {
  return await scrypt.hash(payload);
}

export async function verifyHash(
  rawKey: string,
  storedHash: string,
): Promise<boolean> {
  try {
    return await scrypt.verify(storedHash, rawKey);
  } catch {
    return false;
  }
}

export function generateRawApiKey(type: "public" | "secret"): string {
  const uuid = crypto.randomUUID().replace(/-/g, "");
  const prefix = type === "public" ? "rv_pk" : "rv_sk";
  return `${prefix}_${uuid}`;
}
