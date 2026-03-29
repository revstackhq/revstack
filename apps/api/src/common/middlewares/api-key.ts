import { AppEnv } from "@/container";
import { createMiddleware } from "hono/factory";

export const apiKeyMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  const key = c.req.header("x-api-key");
  if (!key) return c.json({ error: "Missing API Key" }, 401);

  const authData = await c.get("accessService").validateSecretApiKey(key);

  if (!authData) {
    return c.json({ error: "Invalid API Key" }, 403);
  }

  c.set("environmentId", authData.environmentId);
  c.set("scopes", authData.scopes);

  await next();
});
