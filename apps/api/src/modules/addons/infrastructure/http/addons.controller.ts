import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { createAddonSchema } from "@/modules/addons/application/commands/CreateAddonCommand";
import { createManyAddonsSchema } from "@/modules/addons/application/commands/CreateManyAddonsCommand";
import { listAddonsSchema } from "@/modules/addons/application/queries/ListAddonsQuery";
import type { AppEnv } from "@/container";

export const addonsController = new OpenAPIHono<AppEnv>();

const createAddonRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["Addons"],
  summary: "Create an addon",
  description:
    "Creates a new purchasable addon that can be attached to subscriptions.",
  request: {
    body: { content: { "application/json": { schema: createAddonSchema } } },
  },
  responses: {
    201: {
      description: "Addon created",
      content: { "application/json": { schema: z.any() } },
    },
    400: { description: "Validation error" },
  },
});
addonsController.openapi(createAddonRoute, async (c) => {
  const handler = c.get("addons").create;
  const dto = c.req.valid("json");
  const result = await handler.handle(dto);
  return c.json(result, 201);
});

const bulkCreateAddonsRoute = createRoute({
  method: "post",
  path: "/bulk",
  tags: ["Addons"],
  summary: "Bulk create addons",
  description: "Creates multiple addons in a single request.",
  request: {
    body: {
      content: { "application/json": { schema: createManyAddonsSchema } },
    },
  },
  responses: {
    201: {
      description: "Addons created",
      content: { "application/json": { schema: z.any() } },
    },
  },
});
addonsController.openapi(bulkCreateAddonsRoute, async (c) => {
  const handler = c.get("addons").createMany;
  const dto = c.req.valid("json");
  const result = await handler.handle(dto);
  return c.json(result, 201);
});

const archiveAddonRoute = createRoute({
  method: "patch",
  path: "/{id}/archive",
  tags: ["Addons"],
  summary: "Archive an addon",
  description: "Marks an addon as archived, preventing new purchases.",
  request: {
    params: z.object({ id: z.string().openapi({ example: "add_abc123" }) }),
  },
  responses: {
    200: {
      description: "Addon archived",
      content: {
        "application/json": {
          schema: z.object({ success: z.boolean(), message: z.string() }),
        },
      },
    },
  },
});
addonsController.openapi(archiveAddonRoute, async (c) => {
  const handler = c.get("addons").archive;
  const { id } = c.req.valid("param");
  await handler.handle({ id });
  return c.json({ success: true, message: "Addon archived successfully" }, 200);
});

const listAddonsRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Addons"],
  summary: "List addons",
  description: "Retrieves addons with optional filtering.",
  request: { query: listAddonsSchema },
  responses: {
    200: {
      description: "List of addons",
      content: { "application/json": { schema: z.array(z.any()) } },
    },
  },
});
addonsController.openapi(listAddonsRoute, async (c) => {
  const handler = c.get("addons").list;
  const query = c.req.valid("query");
  const result = await handler.handle(query);
  return c.json(result, 200);
});

const getAddonRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["Addons"],
  summary: "Get an addon",
  description: "Retrieves a single addon by ID.",
  request: {
    params: z.object({ id: z.string().openapi({ example: "add_abc123" }) }),
  },
  responses: {
    200: {
      description: "Addon details",
      content: { "application/json": { schema: z.any() } },
    },
  },
});
addonsController.openapi(getAddonRoute, async (c) => {
  const handler = c.get("addons").get;
  const { id } = c.req.valid("param");
  const result = await handler.handle({ id });
  return c.json(result, 200);
});
