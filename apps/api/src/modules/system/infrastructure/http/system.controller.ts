import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createApiKeySchema } from "@/modules/system/application/commands/CreateApiKeyCommand";
import { updateApiKeySchema } from "@/modules/system/application/commands/UpdateApiKeyCommand";
import type { AppEnv } from "@/container";
import { listApiKeysSchema } from "@/modules/system/application/queries/ListApiKeysQuery";

export const systemController = new Hono<AppEnv>();

systemController.post(
  "/api-keys",
  zValidator("json", createApiKeySchema),
  async (c) => {
    const handler = c.get("system").createApiKey;
    const dto = c.req.valid("json");
    const result = await handler.handle(dto);
    return c.json({ ...result, success: true }, 201);
  }
);

systemController.get("/api-keys", zValidator("query", listApiKeysSchema), async (c) => {
  const handler = c.get("system").listApiKeys;
  const query = c.req.valid("query");
  const result = await handler.handle(query);
  return c.json(result, 200);
});

systemController.get("/api-keys/:key", async (c) => {
  const handler = c.get("system").getApiKey;
  const result = await handler.handle({ keyId: c.req.param("key") });
  return c.json(result, 200);
});

systemController.patch("/api-keys/:key", zValidator("json", updateApiKeySchema), async (c) => {
  const handler = c.get("system").updateApiKey;
  const dto = c.req.valid("json");
  const result = await handler.handle({ keyId: c.req.param("key"), ...dto });
  return c.json(result, 200);
});

systemController.post("/api-keys/:key/rotate", async (c) => {
  const handler = c.get("system").rotateApiKey;
  const result = await handler.handle({ keyId: c.req.param("key") });
  return c.json(result, 200);
});

systemController.delete("/api-keys/:key", async (c) => {
  const handler = c.get("system").deleteApiKey;
  await handler.handle({ keyId: c.req.param("key") });
  return c.json({ success: true, message: "API key deleted successfully" }, 200);
});

systemController.get("/verify", async (c) => {
  const handler = c.get("system").verifyApiKey;
  const authHeader = c.req.header("Authorization");
  const apiKey = authHeader?.replace("Bearer ", "") || "";
  const result = await handler.handle({ apiKey });
  return c.json(result, 200);
});
