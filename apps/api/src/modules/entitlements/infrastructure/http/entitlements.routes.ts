import { createRoute, z } from "@hono/zod-openapi";
import {
  CreateEntitlementCommandSchema,
  CreateEntitlementResponseSchema,
} from "@/modules/entitlements/application/use-cases/CreateEntitlement";
import {
  UpdateEntitlementCommandSchema,
  UpdateEntitlementResponseSchema,
} from "@/modules/entitlements/application/use-cases/UpdateEntitlement";
import { ArchiveEntitlementResponseSchema } from "@/modules/entitlements/application/use-cases/ArchiveEntitlement";
import { GetEntitlementResponseSchema } from "@/modules/entitlements/application/use-cases/GetEntitlement";
import {
  ListEntitlementsQuerySchema,
  ListEntitlementsResponseSchema,
} from "@/modules/entitlements/application/use-cases/ListEntitlements";

export const createEntitlementRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["Entitlements"],
  summary: "Create a new entitlement",
  description: "Creates a new entitlement feature for the environment.",
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateEntitlementCommandSchema.omit({ environment_id: true }),
        },
      },
    },
  },
  responses: {
    201: {
      description: "Entitlement created",
      content: {
        "application/json": { schema: CreateEntitlementResponseSchema },
      },
    },
  },
});

export const updateEntitlementRoute = createRoute({
  method: "patch",
  path: "/{id}",
  tags: ["Entitlements"],
  summary: "Update an entitlement",
  description: "Updates an existing entitlement.",
  request: {
    params: z.object({ id: z.string().openapi({ example: "ent_abc123" }) }),
    body: {
      content: {
        "application/json": {
          schema: UpdateEntitlementCommandSchema.omit({
            environment_id: true,
            id: true,
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Entitlement updated",
      content: {
        "application/json": { schema: UpdateEntitlementResponseSchema },
      },
    },
  },
});

export const archiveEntitlementRoute = createRoute({
  method: "post",
  path: "/{id}/archive",
  tags: ["Entitlements"],
  summary: "Archive an entitlement",
  description: "Archives an entitlement, soft-deleting it from active access.",
  request: {
    params: z.object({ id: z.string().openapi({ example: "ent_abc123" }) }),
  },
  responses: {
    200: {
      description: "Entitlement archived",
      content: {
        "application/json": { schema: ArchiveEntitlementResponseSchema },
      },
    },
  },
});

export const getEntitlementRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["Entitlements"],
  summary: "Get an entitlement",
  description: "Retrieves an entitlement by its ID.",
  request: {
    params: z.object({ id: z.string().openapi({ example: "ent_abc123" }) }),
  },
  responses: {
    200: {
      description: "Entitlement retrieved",
      content: { "application/json": { schema: GetEntitlementResponseSchema } },
    },
  },
});

export const listEntitlementsRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Entitlements"],
  summary: "List entitlements",
  description: "Retrieves a list of entitlements.",
  request: {
    query: ListEntitlementsQuerySchema.omit({ environment_id: true }),
  },
  responses: {
    200: {
      description: "Entitlements retrieved",
      content: {
        "application/json": { schema: ListEntitlementsResponseSchema },
      },
    },
  },
});
