import { createRoute, z } from "@hono/zod-openapi";
import { createPriceSchema } from "@/modules/prices/application/use-cases/CreatePrice";
import { updatePriceSchema } from "@/modules/prices/application/use-cases/UpdatePrice";
import { versionPriceSchema } from "@/modules/prices/application/use-cases/VersionPrice";
import { listPricesSchema } from "@/modules/prices/application/use-cases/ListPrices";

export const createPriceRoute = createRoute({
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

export const updatePriceRoute = createRoute({
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

export const versionPriceRoute = createRoute({
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

export const listPricesRoute = createRoute({
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

export const getPriceRoute = createRoute({
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
