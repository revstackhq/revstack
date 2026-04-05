import type { AppEnv } from "@/container";
import { createMiddleware } from "hono/factory";

export const requireAuth = createMiddleware<AppEnv>(async (c, next) => {
  // --- Strategy 1: API Key (x-api-key header) ---
  const apiKey = c.req.header("x-api-key");

  if (apiKey) {
    const authData = await c.get("accessService").validateSecretApiKey(apiKey);

    if (authData) {
      c.set("environmentId", authData.environmentId);
      c.set("scopes", authData.scopes);
      c.set("authType", "api_key");
      return next();
    }
  }

  // --- Strategy 2: JWT (Authorization: Bearer <token>) ---
  const authHeader = c.req.header("Authorization");

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);

    try {
      const payload = await c.get("jwtService").verify(token);

      c.set("environmentId", payload.environmentId);
      c.set("scopes", payload.scopes ?? []);
      c.set("authType", "jwt");

      if (payload.sub) {
        c.set("userId", payload.sub);
      }

      return next();
    } catch {
      // Token invalid — fall through to 401
    }
  }

  return c.json(
    {
      error: "Unauthorized",
      message: "Valid API key or Bearer token required",
    },
    401,
  );
});
