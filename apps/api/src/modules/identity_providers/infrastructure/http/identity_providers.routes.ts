import { createRoute, z } from "@hono/zod-openapi";
import { putAuthConfigSchema } from "@/modules/identity_providers/application/use-cases/PutAuthConfig";
import { listAuthConfigsSchema } from "@/modules/identity_providers/application/use-cases/ListAuthConfigs";

export const putAuthConfigRoute = createRoute({
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

export const listAuthConfigsRoute = createRoute({
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

export const getAuthConfigRoute = createRoute({
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
