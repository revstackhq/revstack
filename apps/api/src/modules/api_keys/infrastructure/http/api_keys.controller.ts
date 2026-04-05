import { OpenAPIHono } from "@hono/zod-openapi";
import type { AppEnv } from "@/container";
import {
  createApiKeyRoute,
  listApiKeysRoute,
  getApiKeyRoute,
  updateApiKeyRoute,
  rotateApiKeyRoute,
  deleteApiKeyRoute,
  verifyApiKeyRoute,
} from "@/modules/api_keys/infrastructure/http/api_keys.routes";

export const apiKeysController = new OpenAPIHono<AppEnv>();

apiKeysController.openapi(createApiKeyRoute, async (c) => {
  const handler = c.get("system").createApiKey;
  const payload = c.req.valid("json");
  const environmentId = c.get("environmentId");
  const result = await handler.execute({
    ...payload,
    environment_id: environmentId,
  });
  return c.json({ ...result, success: true }, 201);
});

apiKeysController.openapi(listApiKeysRoute, async (c) => {
  const handler = c.get("system").listApiKeys;
  const query = c.req.valid("query");
  const result = await handler.execute(query);
  return c.json(result, 200);
});

apiKeysController.openapi(getApiKeyRoute, async (c) => {
  const handler = c.get("system").getApiKey;
  const { key } = c.req.valid("param");
  const result = await handler.execute({ keyId: key });
  return c.json(result, 200);
});

apiKeysController.openapi(updateApiKeyRoute, async (c) => {
  const handler = c.get("system").updateApiKey;
  const { key } = c.req.valid("param");
  const environmentId = c.get("environmentId");
  const payload = c.req.valid("json");
  const result = await handler.execute({
    ...payload,
    id: key,
    environment_id: environmentId,
  });
  return c.json(result, 200);
});

apiKeysController.openapi(rotateApiKeyRoute, async (c) => {
  const handler = c.get("system").rotateApiKey;
  const { key } = c.req.valid("param");
  const environmentId = c.get("environmentId");
  const actorId = c.get("actorId");

  const result = await handler.execute({
    id: key,
    environment_id: environmentId,
    actor_id: actorId!,
  });

  return c.json(result, 200);
});

apiKeysController.openapi(deleteApiKeyRoute, async (c) => {
  const handler = c.get("system").deleteApiKey;
  const { key } = c.req.valid("param");
  const environmentId = c.get("environmentId");

  await handler.execute({
    id: key,
    environment_id: environmentId,
  });

  return c.json(
    { success: true, message: "API key deleted successfully" },
    200,
  );
});

apiKeysController.openapi(verifyApiKeyRoute, async (c) => {
  const handler = c.get("system").verifyApiKey;
  const authHeader = c.req.header("Authorization");
  const apiKey = authHeader?.replace("Bearer ", "") || "";
  const result = await handler.execute({ apiKey });
  return c.json(result, 200);
});
