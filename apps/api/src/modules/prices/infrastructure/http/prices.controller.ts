import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { createPriceSchema } from "@/modules/prices/application/commands/CreatePriceCommand";
import { updatePriceSchema } from "@/modules/prices/application/commands/UpdatePriceCommand";
import { versionPriceSchema } from "@/modules/prices/application/commands/VersionPriceCommand";
import { listPricesSchema } from "@/modules/prices/application/queries/ListPricesQuery";
import type { AppEnv } from "@/container";

export const pricesController = new OpenAPIHono<AppEnv>();

const createPriceRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["Prices"],
  summary: "Create a price",
  description: "Creates a new price linked to a plan or addon.",
  request: {
    body: { content: { "application/json": { schema: createPriceSchema } } },
  },
  responses: {
    201: {
      description: "Price created",
      content: { "application/json": { schema: z.any() } },
    },
    400: { description: "Validation error" },
  },
});
pricesController.openapi(createPriceRoute, async (c) => {
  const handler = c.get("prices").create;
  const dto = c.req.valid("json");
  const result = await handler.handle(dto);
  return c.json(result, 201);
});

const updatePriceRoute = createRoute({
  method: "patch",
  path: "/{id}",
  tags: ["Prices"],
  summary: "Update a price",
  description: "Updates mutable fields of an existing price (name, metadata).",
  request: {
    params: z.object({ id: z.string().openapi({ example: "price_abc123" }) }),
    body: { content: { "application/json": { schema: updatePriceSchema } } },
  },
  responses: {
    200: {
      description: "Price updated",
      content: { "application/json": { schema: z.any() } },
    },
  },
});
pricesController.openapi(updatePriceRoute, async (c) => {
  const handler = c.get("prices").update;
  const { id } = c.req.valid("param");
  const dto = c.req.valid("json");
  const result = await handler.handle({ priceId: id, ...dto });
  return c.json(result, 200);
});

const versionPriceRoute = createRoute({
  method: "post",
  path: "/{id}/version",
  tags: ["Prices"],
  summary: "Create a new price version",
  description:
    "Archives the current price and creates a new version with updated amount.",
  request: {
    params: z.object({ id: z.string().openapi({ example: "price_abc123" }) }),
    body: { content: { "application/json": { schema: versionPriceSchema } } },
  },
  responses: {
    201: {
      description: "New price version created",
      content: { "application/json": { schema: z.any() } },
    },
  },
});
pricesController.openapi(versionPriceRoute, async (c) => {
  const handler = c.get("prices").version;
  const { id } = c.req.valid("param");
  const dto = c.req.valid("json");
  const result = await handler.handle({ priceId: id, ...dto });
  return c.json(result, 201);
});

const listPricesRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Prices"],
  summary: "List prices",
  description:
    "Retrieves prices with optional filtering by plan, environment, or archive status.",
  request: { query: listPricesSchema },
  responses: {
    200: {
      description: "List of prices",
      content: { "application/json": { schema: z.array(z.any()) } },
    },
  },
});
pricesController.openapi(listPricesRoute, async (c) => {
  const handler = c.get("prices").list;
  const query = c.req.valid("query");
  const result = await handler.handle(query);
  return c.json(result, 200);
});

const getPriceRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["Prices"],
  summary: "Get a price",
  description: "Retrieves a single price by ID.",
  request: {
    params: z.object({ id: z.string().openapi({ example: "price_abc123" }) }),
  },
  responses: {
    200: {
      description: "Price details",
      content: { "application/json": { schema: z.any() } },
    },
  },
});

pricesController.openapi(getPriceRoute, async (c) => {
  const handler = c.get("prices").get;
  const { id } = c.req.valid("param");
  const result = await handler.handle({ id });
  return c.json(result, 200);
});
