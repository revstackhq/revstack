import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { putAuthConfigSchema } from "@/modules/auth/application/commands/PutAuthConfigCommand";
import { listAuthConfigsSchema } from "@/modules/auth/application/queries/ListAuthConfigsQuery";
import type { AppEnv } from "@/container";

export const authController = new OpenAPIHono<AppEnv>();

const putAuthConfigRoute = createRoute({
  method: "put",
  path: "/",
  tags: ["Auth"],
  summary: "Upsert auth configuration",
  description:
    "Creates or replaces the authentication provider configuration (JWKS/JWT) for an environment.",
  request: {
    body: { content: { "application/json": { schema: putAuthConfigSchema } } },
  },
  responses: {
    200: {
      description: "Auth config saved",
      content: { "application/json": { schema: z.any() } },
    },
  },
});
authController.openapi(putAuthConfigRoute, async (c) => {
  const handler = c.get("auth").putConfig;
  const dto = c.req.valid("json");
  const result = await handler.handle(dto);
  return c.json(result, 200);
});

const listAuthConfigsRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Auth"],
  summary: "List auth configurations",
  description:
    "Retrieves all authentication configurations for an environment.",
  request: { query: listAuthConfigsSchema },
  responses: {
    200: {
      description: "List of auth configs",
      content: { "application/json": { schema: z.array(z.any()) } },
    },
  },
});
authController.openapi(listAuthConfigsRoute, async (c) => {
  const handler = c.get("auth").listConfigs;
  const query = c.req.valid("query");
  const result = await handler.handle(query);
  return c.json(result, 200);
});

const getAuthConfigRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["Auth"],
  summary: "Get an auth configuration",
  description: "Retrieves a specific authentication configuration by ID.",
  request: {
    params: z.object({ id: z.string().openapi({ example: "auth_abc123" }) }),
  },
  responses: {
    200: {
      description: "Auth config details",
      content: { "application/json": { schema: z.any() } },
    },
  },
});
authController.openapi(getAuthConfigRoute, async (c) => {
  const handler = c.get("auth").getConfig;
  const { id } = c.req.valid("param");
  const result = await handler.handle({ id });
  return c.json(result, 200);
});
