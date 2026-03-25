import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { createEntitlementSchema } from "@/modules/entitlements/application/commands/CreateEntitlementCommand";
import { listEntitlementsSchema } from "@/modules/entitlements/application/queries/ListEntitlementsQuery";
import type { AppEnv } from "@/container";

export const entitlementsController = new OpenAPIHono<AppEnv>();

const listEntitlementsRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Entitlements"],
  summary: "List entitlements",
  description: "Retrieves all entitlements for a given environment.",
  request: { query: listEntitlementsSchema },
  responses: {
    200: {
      description: "List of entitlements",
      content: { "application/json": { schema: z.array(z.any()) } },
    },
  },
});

entitlementsController.openapi(listEntitlementsRoute, async (c) => {
  const handler = c.get("entitlements").list;
  const query = c.req.valid("query");
  const result = await handler.handle(query);
  return c.json(result, 200);
});

const createEntitlementRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["Entitlements"],
  summary: "Create an entitlement",
  description:
    "Creates a new entitlement definition (feature flag, usage limit, etc.).",
  request: {
    body: {
      content: { "application/json": { schema: createEntitlementSchema } },
    },
  },
  responses: {
    201: {
      description: "Entitlement created",
      content: { "application/json": { schema: z.any() } },
    },
    400: { description: "Validation error" },
  },
});

entitlementsController.openapi(createEntitlementRoute, async (c) => {
  const handler = c.get("entitlements").create;
  const dto = c.req.valid("json");
  const result = await handler.handle(dto);
  return c.json(result, 201);
});

const deleteEntitlementRoute = createRoute({
  method: "delete",
  path: "/{id}",
  tags: ["Entitlements"],
  summary: "Delete an entitlement",
  description: "Permanently removes an entitlement definition.",
  request: {
    params: z.object({ id: z.string().openapi({ example: "ent_abc123" }) }),
  },
  responses: {
    200: {
      description: "Entitlement deleted",
      content: { "application/json": { schema: z.any() } },
    },
  },
});
entitlementsController.openapi(deleteEntitlementRoute, async (c) => {
  const handler = c.get("entitlements").delete;
  const { id } = c.req.valid("param");
  const result = await handler.handle({ id });
  return c.json(result, 200);
});
