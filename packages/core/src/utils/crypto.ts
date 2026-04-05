export async function hashString(payload: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(payload);

  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function generateRawApiKey(type: "public" | "secret"): string {
  const uuid = crypto.randomUUID().replace(/-/g, "");
  const prefix = type === "public" ? "rv_pk" : "rv_sk";
  return `${prefix}_${uuid}`;
}
