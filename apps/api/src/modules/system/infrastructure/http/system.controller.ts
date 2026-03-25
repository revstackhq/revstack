import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { createApiKeySchema } from "@/modules/system/application/commands/CreateApiKeyCommand";
import { updateApiKeySchema } from "@/modules/system/application/commands/UpdateApiKeyCommand";
import { listApiKeysSchema } from "@/modules/system/application/queries/ListApiKeysQuery";
import type { AppEnv } from "@/container";

export const systemController = new OpenAPIHono<AppEnv>();

const createApiKeyRoute = createRoute({
  method: "post",
  path: "/api-keys",
  tags: ["API Keys"],
  summary: "Create an API key",
  description:
    "Generates a new API key for programmatic access. The plain-text key is only returned once.",
  request: {
    body: { content: { "application/json": { schema: createApiKeySchema } } },
  },
  responses: {
    201: {
      description: "API key created",
      content: { "application/json": { schema: z.any() } },
    },
  },
});
systemController.openapi(createApiKeyRoute, async (c) => {
  const handler = c.get("system").createApiKey;
  const dto = c.req.valid("json");
  const result = await handler.handle(dto);
  return c.json({ ...result, success: true }, 201);
});

const listApiKeysRoute = createRoute({
  method: "get",
  path: "/api-keys",
  tags: ["API Keys"],
  summary: "List API keys",
  description:
    "Retrieves all API keys for an environment (without plain-text values).",
  request: { query: listApiKeysSchema },
  responses: {
    200: {
      description: "List of API keys",
      content: { "application/json": { schema: z.array(z.any()) } },
    },
  },
});
systemController.openapi(listApiKeysRoute, async (c) => {
  const handler = c.get("system").listApiKeys;
  const query = c.req.valid("query");
  const result = await handler.handle(query);
  return c.json(result, 200);
});

const getApiKeyRoute = createRoute({
  method: "get",
  path: "/api-keys/{key}",
  tags: ["API Keys"],
  summary: "Get an API key",
  description: "Retrieves metadata for a specific API key.",
  request: {
    params: z.object({
      key: z.string().openapi({ example: "sk_live_abc123" }),
    }),
  },
  responses: {
    200: {
      description: "API key details",
      content: { "application/json": { schema: z.any() } },
    },
  },
});
systemController.openapi(getApiKeyRoute, async (c) => {
  const handler = c.get("system").getApiKey;
  const { key } = c.req.valid("param");
  const result = await handler.handle({ keyId: key });
  return c.json(result, 200);
});

const updateApiKeyRoute = createRoute({
  method: "patch",
  path: "/api-keys/{key}",
  tags: ["API Keys"],
  summary: "Update an API key",
  description: "Updates the name or scopes of an existing API key.",
  request: {
    params: z.object({
      key: z.string().openapi({ example: "sk_live_abc123" }),
    }),
    body: { content: { "application/json": { schema: updateApiKeySchema } } },
  },
  responses: {
    200: {
      description: "API key updated",
      content: { "application/json": { schema: z.any() } },
    },
  },
});
systemController.openapi(updateApiKeyRoute, async (c) => {
  const handler = c.get("system").updateApiKey;
  const { key } = c.req.valid("param");
  const dto = c.req.valid("json");
  const result = await handler.handle({ keyId: key, ...dto });
  return c.json(result, 200);
});

const rotateApiKeyRoute = createRoute({
  method: "post",
  path: "/api-keys/{key}/rotate",
  tags: ["API Keys"],
  summary: "Rotate an API key",
  description: "Generates a new key value and archives the old one.",
  request: {
    params: z.object({
      key: z.string().openapi({ example: "sk_live_abc123" }),
    }),
  },
  responses: {
    200: {
      description: "New key generated",
      content: { "application/json": { schema: z.any() } },
    },
  },
});
systemController.openapi(rotateApiKeyRoute, async (c) => {
  const handler = c.get("system").rotateApiKey;
  const { key } = c.req.valid("param");
  const result = await handler.handle({ keyId: key });
  return c.json(result, 200);
});

const deleteApiKeyRoute = createRoute({
  method: "delete",
  path: "/api-keys/{key}",
  tags: ["API Keys"],
  summary: "Delete an API key",
  description: "Permanently deletes an API key.",
  request: {
    params: z.object({
      key: z.string().openapi({ example: "sk_live_abc123" }),
    }),
  },
  responses: {
    200: {
      description: "API key deleted",
      content: {
        "application/json": {
          schema: z.object({ success: z.boolean(), message: z.string() }),
        },
      },
    },
  },
});
systemController.openapi(deleteApiKeyRoute, async (c) => {
  const handler = c.get("system").deleteApiKey;
  const { key } = c.req.valid("param");
  await handler.handle({ keyId: key });
  return c.json(
    { success: true, message: "API key deleted successfully" },
    200,
  );
});

const verifyApiKeyRoute = createRoute({
  method: "get",
  path: "/verify",
  tags: ["API Keys"],
  summary: "Verify an API key",
  description:
    "Validates a Bearer token from the Authorization header and returns key metadata.",
  responses: {
    200: {
      description: "Verification result",
      content: { "application/json": { schema: z.any() } },
    },
  },
});
systemController.openapi(verifyApiKeyRoute, async (c) => {
  const handler = c.get("system").verifyApiKey;
  const authHeader = c.req.header("Authorization");
  const apiKey = authHeader?.replace("Bearer ", "") || "";
  const result = await handler.handle({ apiKey });
  return c.json(result, 200);
});
