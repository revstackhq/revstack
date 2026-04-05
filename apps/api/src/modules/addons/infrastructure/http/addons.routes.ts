import { createRoute, z } from "@hono/zod-openapi";
import { CreateAddonEntitlementCommandSchema, CreateAddonEntitlementResponseSchema } from "@/modules/addons/application/use-cases/CreateAddonEntitlement";
import { ListAddonEntitlementsQuerySchema, ListAddonEntitlementsResponseSchema } from "@/modules/addons/application/use-cases/ListAddonEntitlements";

// --- Addon Routes ---

export const createAddonRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["Addons"],
  summary: "Create an addon",
  request: {
    body: { content: { "application/json": { schema: z.any() } } },
  },
  responses: {
    201: { description: "Addon created", content: { "application/json": { schema: z.any() } } },
  },
});

export const bulkCreateAddonsRoute = createRoute({
  method: "post",
  path: "/bulk",
  tags: ["Addons"],
  summary: "Bulk create addons",
  request: {
    body: { content: { "application/json": { schema: z.any() } } },
  },
  responses: {
    201: { description: "Addons created", content: { "application/json": { schema: z.any() } } },
  },
});

export const archiveAddonRoute = createRoute({
  method: "patch",
  path: "/{id}/archive",
  tags: ["Addons"],
  summary: "Archive an addon",
  request: {
    params: z.object({ id: z.string().openapi({ example: "add_abc123" }) }),
  },
  responses: {
    200: { description: "Addon archived", content: { "application/json": { schema: z.any() } } },
  },
});

export const listAddonsRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Addons"],
  summary: "List addons",
  responses: {
    200: { description: "List of addons", content: { "application/json": { schema: z.array(z.any()) } } },
  },
});

export const getAddonRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["Addons"],
  summary: "Get an addon",
  request: {
    params: z.object({ id: z.string().openapi({ example: "add_abc123" }) }),
  },
  responses: {
    200: { description: "Addon details", content: { "application/json": { schema: z.any() } } },
  },
});

// --- Addon Entitlement Routes (nested under /:addonId/entitlements) ---

export const listAddonEntitlementsRoute = createRoute({
  method: "get",
  path: "/{addonId}/entitlements",
  tags: ["Addon Entitlements"],
  summary: "List entitlements for an addon",
  request: {
    params: z.object({
      addonId: z.string().openapi({ example: "add_abc123" }),
    }),
    query: ListAddonEntitlementsQuerySchema,
  },
  responses: {
    200: {
      description: "List of addon entitlements",
      content: { "application/json": { schema: ListAddonEntitlementsResponseSchema } },
    },
  },
});

export const createAddonEntitlementRoute = createRoute({
  method: "put",
  path: "/{addonId}/entitlements/{featureId}",
  tags: ["Addon Entitlements"],
  summary: "Attach or update an entitlement on an addon",
  request: {
    params: z.object({
      addonId: z.string().openapi({ example: "add_abc123" }),
      featureId: z.string().openapi({ example: "feat_ai_tokens" }),
    }),
    body: {
      content: { "application/json": { schema: CreateAddonEntitlementCommandSchema } },
    },
  },
  responses: {
    200: {
      description: "Addon entitlement saved",
      content: { "application/json": { schema: CreateAddonEntitlementResponseSchema } },
    },
    400: { description: "Validation error" },
    409: { description: "Already exists" },
  },
});

export const getAddonEntitlementRoute = createRoute({
  method: "get",
  path: "/{addonId}/entitlements/{featureId}",
  tags: ["Addon Entitlements"],
  summary: "Get an addon entitlement",
  request: {
    params: z.object({
      addonId: z.string().openapi({ example: "add_abc123" }),
      featureId: z.string().openapi({ example: "feat_ai_tokens" }),
    }),
  },
  responses: {
    200: { description: "Addon entitlement details", content: { "application/json": { schema: z.any() } } },
    404: { description: "Not found" },
  },
});

export const deleteAddonEntitlementRoute = createRoute({
  method: "delete",
  path: "/{addonId}/entitlements/{featureId}",
  tags: ["Addon Entitlements"],
  summary: "Detach an entitlement from an addon",
  request: {
    params: z.object({
      addonId: z.string().openapi({ example: "add_abc123" }),
      featureId: z.string().openapi({ example: "feat_ai_tokens" }),
    }),
  },
  responses: {
    200: {
      description: "Addon entitlement removed",
      content: { "application/json": { schema: z.object({ success: z.boolean() }) } },
    },
    404: { description: "Not found" },
  },
});
