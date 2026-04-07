import { createRoute, z } from "@hono/zod-openapi";
import {
  CreateAddonCommandSchema,
  CreateAddonResponseSchema,
} from "@/modules/addons/application/use-cases/CreateAddon";
import {
  ListAddonsQuerySchema,
  ListAddonsResponseSchema,
} from "@/modules/addons/application/use-cases/ListAddons";
import { GetAddonResponseSchema } from "@/modules/addons/application/use-cases/GetAddon";
import { ArchiveAddonResponseSchema } from "@/modules/addons/application/use-cases/ArchiveAddon";
import {
  UpsertAddonEntitlementCommandSchema,
  UpsertAddonEntitlementResponseSchema,
} from "@/modules/addons/application/use-cases/UpsertAddonEntitlement";
import { RemoveAddonEntitlementResponseSchema } from "@/modules/addons/application/use-cases/RemoveAddonEntitlement";
import {
  UpdateAddonCommandSchema,
  UpdateAddonResponseSchema,
} from "@/modules/addons/application/use-cases/UpdateAddon";

export const createAddonRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["Addons"],
  summary: "Create an addon",
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateAddonCommandSchema.omit({ environment_id: true }),
        },
      },
    },
  },
  responses: {
    201: {
      description: "Addon created",
      content: { "application/json": { schema: CreateAddonResponseSchema } },
    },
  },
});

export const listAddonsRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Addons"],
  summary: "List addons",
  request: {
    query: ListAddonsQuerySchema.omit({ environment_id: true }),
  },
  responses: {
    200: {
      description: "Paginated list of addons",
      content: { "application/json": { schema: ListAddonsResponseSchema } },
    },
  },
});

export const getAddonRoute = createRoute({
  method: "get",
  path: "/{id_or_slug}",
  tags: ["Addons"],
  summary: "Get an addon",
  request: {
    params: z.object({
      id_or_slug: z.string().openapi({ example: "add_123" }),
    }),
  },
  responses: {
    200: {
      description: "Addon details",
      content: { "application/json": { schema: GetAddonResponseSchema } },
    },
  },
});

export const archiveAddonRoute = createRoute({
  method: "delete",
  path: "/{id}",
  tags: ["Addons"],
  summary: "Archive an addon",
  request: {
    params: z.object({ id: z.string().openapi({ example: "add_123" }) }),
  },
  responses: {
    200: {
      description: "Addon archived",
      content: { "application/json": { schema: ArchiveAddonResponseSchema } },
    },
  },
});

export const updateAddonRoute = createRoute({
  method: "put",
  path: "/{id}",
  tags: ["Addons"],
  summary: "Update an addon",
  request: {
    params: z.object({ id: z.string().openapi({ example: "add_123" }) }),
    body: {
      content: {
        "application/json": {
          schema: UpdateAddonCommandSchema.omit({
            environment_id: true,
            id: true,
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Addon updated",
      content: { "application/json": { schema: UpdateAddonResponseSchema } },
    },
  },
});

export const createAddonEntitlementRoute = createRoute({
  method: "put",
  path: "/{addon_id}/entitlements/{entitlement_id}",
  tags: ["Addon Entitlements"],
  summary: "Upsert an entitlement into an addon",
  request: {
    params: z.object({
      addon_id: z.string().openapi({ example: "add_123" }),
      entitlement_id: z.string().openapi({ example: "ent_456" }),
    }),
    body: {
      content: {
        "application/json": {
          schema: UpsertAddonEntitlementCommandSchema.omit({
            environment_id: true,
            addon_id: true,
            entitlement_id: true,
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Entitlement upserted",
      content: {
        "application/json": { schema: UpsertAddonEntitlementResponseSchema },
      },
    },
  },
});

export const deleteAddonEntitlementRoute = createRoute({
  method: "delete",
  path: "/{addon_id}/entitlements/{entitlement_id}",
  tags: ["Addon Entitlements"],
  summary: "Remove an entitlement from an addon",
  request: {
    params: z.object({
      addon_id: z.string().openapi({ example: "add_123" }),
      entitlement_id: z.string().openapi({ example: "ent_456" }),
    }),
  },
  responses: {
    200: {
      description: "Entitlement removed",
      content: {
        "application/json": { schema: RemoveAddonEntitlementResponseSchema },
      },
    },
  },
});
