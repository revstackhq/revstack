import { createRoute, z } from "@hono/zod-openapi";
import { CreateAddonCommandSchema } from "@/modules/addons/application/use-cases/CreateAddon/CreateAddon.schema";
import { CreateManyAddonsCommandSchema } from "@/modules/addons/application/use-cases/CreateManyAddons/CreateManyAddons.schema";
import { ListAddonsQuerySchema } from "@/modules/addons/application/use-cases/ListAddons/ListAddons.schema";

export const createAddonRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["Addons"],
  summary: "Create an addon",
  request: {
    body: {
      content: { "application/json": { schema: CreateAddonCommandSchema } },
    },
  },
  responses: {
    201: {
      description: "Addon created",
      content: { "application/json": { schema: z.any() } },
    },
    400: { description: "Validation error" },
  },
});

export const bulkCreateAddonsRoute = createRoute({
  method: "post",
  path: "/bulk",
  tags: ["Addons"],
  summary: "Bulk create addons",
  request: {
    body: {
      content: {
        "application/json": { schema: CreateManyAddonsCommandSchema },
      },
    },
  },
  responses: {
    201: {
      description: "Addons created",
      content: { "application/json": { schema: z.any() } },
    },
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
    200: {
      description: "Addon archived",
      content: {
        "application/json": {
          schema: z.object({ success: z.boolean() }),
        },
      },
    },
  },
});

export const listAddonsRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Addons"],
  summary: "List addons",
  request: { query: ListAddonsQuerySchema },
  responses: {
    200: {
      description: "List of addons",
      content: { "application/json": { schema: z.array(z.any()) } },
    },
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
    200: {
      description: "Addon details",
      content: { "application/json": { schema: z.any() } },
    },
    404: { description: "Not found" },
  },
});
