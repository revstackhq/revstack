import { createRoute, z } from "@hono/zod-openapi";
import { CreateEntitlementCommandSchema } from "@/modules/entitlements/application/use-cases/CreateEntitlement/CreateEntitlement.schema";
import { ListEntitlementsQuerySchema } from "@/modules/entitlements/application/use-cases/ListEntitlements/ListEntitlements.schema";

export const listEntitlementsRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Entitlements"],
  summary: "List entitlements",
  description: "Retrieves all entitlements for a given environment.",
  request: { query: ListEntitlementsQuerySchema },
  responses: {
    200: {
      description: "List of entitlements",
      content: { "application/json": { schema: z.array(z.any()) } },
    },
  },
});

export const createEntitlementRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["Entitlements"],
  summary: "Create an entitlement",
  description: "Creates a new entitlement definition (feature flag, usage limit, etc.).",
  request: {
    body: {
      content: { "application/json": { schema: CreateEntitlementCommandSchema } },
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

export const deleteEntitlementRoute = createRoute({
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
