import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { createAddonEntitlementSchema } from "@/modules/addon_entitlements/application/commands/CreateAddonEntitlementCommand";
import { listAddonEntitlementsSchema } from "@/modules/addon_entitlements/application/queries/ListAddonEntitlementsQuery";
import type { AppEnv } from "@/container";

export const addonEntitlementsController = new OpenAPIHono<AppEnv>();

const createAddonEntitlementRoute = createRoute({
  method: "post",
  path: "/{addonId}",
  tags: ["Addon Entitlements"],
  summary: "Attach an entitlement to an addon",
  description: "Links an entitlement definition to an addon.",
  request: {
    params: z.object({
      addonId: z.string().openapi({ example: "add_abc123" }),
    }),
    body: {
      content: { "application/json": { schema: createAddonEntitlementSchema } },
    },
  },
  responses: {
    201: {
      description: "Addon entitlement created",
      content: { "application/json": { schema: z.any() } },
    },
    400: { description: "Validation error" },
  },
});
addonEntitlementsController.openapi(createAddonEntitlementRoute, async (c) => {
  const handler = c.get("addonEntitlements").create;
  const { addonId } = c.req.valid("param");
  const dto = c.req.valid("json");
  const result = await handler.handle({ ...dto, addonId });
  return c.json(result, 201);
});

const listAddonEntitlementsRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Addon Entitlements"],
  summary: "List addon entitlements",
  description:
    "Retrieves all entitlements linked to addons, optionally filtered by addonId.",
  request: { query: listAddonEntitlementsSchema },
  responses: {
    200: {
      description: "List of addon entitlements",
      content: { "application/json": { schema: z.array(z.any()) } },
    },
  },
});

addonEntitlementsController.openapi(listAddonEntitlementsRoute, async (c) => {
  const handler = c.get("addonEntitlements").list;
  const query = c.req.valid("query");
  const result = await handler.handle(query);
  return c.json(result, 200);
});

const getAddonEntitlementRoute = createRoute({
  method: "get",
  path: "/{addonId}/{entitlementId}",
  tags: ["Addon Entitlements"],
  summary: "Get an addon entitlement",
  description:
    "Retrieves a specific addon-entitlement association by composite key.",
  request: {
    params: z.object({
      addonId: z.string().openapi({ example: "add_abc123" }),
      entitlementId: z.string().openapi({ example: "ent_abc123" }),
    }),
  },
  responses: {
    200: {
      description: "Addon entitlement details",
      content: { "application/json": { schema: z.any() } },
    },
  },
});

addonEntitlementsController.openapi(getAddonEntitlementRoute, async (c) => {
  const handler = c.get("addonEntitlements").get;
  const { addonId, entitlementId } = c.req.valid("param");
  const result = await handler.handle({ addonId, entitlementId });
  return c.json(result, 200);
});

const deleteAddonEntitlementRoute = createRoute({
  method: "delete",
  path: "/{addonId}/{entitlementId}",
  tags: ["Addon Entitlements"],
  summary: "Detach an entitlement from an addon",
  description: "Removes an addon-entitlement association.",
  request: {
    params: z.object({
      addonId: z.string().openapi({ example: "add_abc123" }),
      entitlementId: z.string().openapi({ example: "ent_abc123" }),
    }),
  },
  responses: {
    200: {
      description: "Addon entitlement removed",
      content: { "application/json": { schema: z.any() } },
    },
  },
});

addonEntitlementsController.openapi(deleteAddonEntitlementRoute, async (c) => {
  const handler = c.get("addonEntitlements").delete;
  const { addonId, entitlementId } = c.req.valid("param");
  const result = await handler.handle({ addonId, entitlementId });
  return c.json(result, 200);
});
