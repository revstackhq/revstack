import { createRoute, z } from "@hono/zod-openapi";
import {
  CreateAddonEntitlementCommandSchema,
  CreateAddonEntitlementResponseSchema,
} from "@/modules/addon_entitlements/application/use-cases/CreateAddonEntitlement/CreateAddonEntitlement.schema";
import {
  ListAddonEntitlementsQuerySchema,
  ListAddonEntitlementsResponseSchema,
} from "@/modules/addon_entitlements/application/use-cases/ListAddonEntitlements/ListAddonEntitlements.schema";

export const createAddonEntitlementRoute = createRoute({
  method: "post",
  path: "/{addon_id}",
  tags: ["Addon Entitlements"],
  summary: "Attach an entitlement to an addon",
  request: {
    params: z.object({
      addon_id: z.string().openapi({ example: "add_abc123" }),
    }),
    body: {
      content: {
        "application/json": { schema: CreateAddonEntitlementCommandSchema },
      },
    },
  },
  responses: {
    201: {
      description: "Addon entitlement created",
      content: {
        "application/json": { schema: CreateAddonEntitlementResponseSchema },
      },
    },
    400: { description: "Validation error" },
    409: { description: "Already exists" },
  },
});

export const listAddonEntitlementsRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Addon Entitlements"],
  summary: "List addon entitlements",
  request: { query: ListAddonEntitlementsQuerySchema },
  responses: {
    200: {
      description: "List of addon entitlements",
      content: {
        "application/json": { schema: ListAddonEntitlementsResponseSchema },
      },
    },
  },
});

export const getAddonEntitlementRoute = createRoute({
  method: "get",
  path: "/{addon_id}/{entitlement_id}",
  tags: ["Addon Entitlements"],
  summary: "Get an addon entitlement",
  request: {
    params: z.object({
      addon_id: z.string().openapi({ example: "add_abc123" }),
      entitlement_id: z.string().openapi({ example: "ent_abc123" }),
    }),
  },
  responses: {
    200: {
      description: "Addon entitlement details",
      content: { "application/json": { schema: z.any() } },
    },
    404: { description: "Not found" },
  },
});

export const deleteAddonEntitlementRoute = createRoute({
  method: "delete",
  path: "/{addon_id}/{entitlement_id}",
  tags: ["Addon Entitlements"],
  summary: "Detach an entitlement from an addon",
  request: {
    params: z.object({
      addon_id: z.string().openapi({ example: "add_abc123" }),
      entitlement_id: z.string().openapi({ example: "ent_abc123" }),
    }),
  },
  responses: {
    200: {
      description: "Addon entitlement removed",
      content: {
        "application/json": {
          schema: z.object({ success: z.boolean() }),
        },
      },
    },
    404: { description: "Not found" },
  },
});
