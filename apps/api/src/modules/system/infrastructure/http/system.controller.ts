import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createApiKeySchema } from "@/modules/system/application/commands/CreateApiKeyCommand";
import type { AppEnv } from "@/container";

export const systemController = new Hono<AppEnv>();

systemController.post(
  "/api-keys",
  zValidator("json", createApiKeySchema),
  async (c) => {
    const handler = c.get("createApiKeyHandler");
    const dto = c.req.valid("json");
    
    // Command
    const result = await handler.handle(dto);
    
    return c.json({ ...result, success: true }, 201);
  }
);

systemController.get("/verify", async (c) => {
  const handler = c.get("verifyApiKeyHandler");
  const authHeader = c.req.header("Authorization");
  const apiKey = authHeader?.replace("Bearer ", "") || "";
  
  // Fast-path Query
  const result = await handler.handle({ apiKey });
  
  return c.json(result, 200);
});
