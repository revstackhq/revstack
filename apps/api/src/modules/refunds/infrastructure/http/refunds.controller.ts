import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { createRefundSchema } from "@/modules/refunds/application/commands/CreateRefundCommand";
import { updateRefundSchema } from "@/modules/refunds/application/commands/UpdateRefundCommand";
import type { AppEnv } from "@/container";

export const refundsController = new OpenAPIHono<AppEnv>();

const createRefundRoute = createRoute({
  method: "post", path: "/payment/{paymentId}", tags: ["Refunds"],
  summary: "Create a refund",
  description: "Creates a refund for a previously processed payment. Supports idempotency keys.",
  request: {
    params: z.object({ paymentId: z.string().openapi({ example: "pay_abc123" }) }),
    body: { content: { "application/json": { schema: createRefundSchema } } },
  },
  responses: {
    201: { description: "Refund created", content: { "application/json": { schema: z.any() } } },
    400: { description: "Validation error" },
    409: { description: "Idempotency conflict" },
  },
});
refundsController.openapi(createRefundRoute, async (c) => {
  const handler = c.get("refunds").create;
  const { paymentId } = c.req.valid("param");
  const dto = c.req.valid("json");
  const result = await handler.handle({ paymentId, ...dto });
  return c.json(result, 201);
});

const updateRefundRoute = createRoute({
  method: "patch", path: "/{id}", tags: ["Refunds"],
  summary: "Update a refund",
  description: "Updates metadata or status of an existing refund.",
  request: {
    params: z.object({ id: z.string().openapi({ example: "ref_abc123" }) }),
    body: { content: { "application/json": { schema: updateRefundSchema } } },
  },
  responses: { 200: { description: "Refund updated", content: { "application/json": { schema: z.any() } } } },
});
refundsController.openapi(updateRefundRoute, async (c) => {
  const handler = c.get("refunds").update;
  const { id } = c.req.valid("param");
  const dto = c.req.valid("json");
  const result = await handler.handle({ id, ...dto });
  return c.json(result, 200);
});

const listRefundsRoute = createRoute({
  method: "get", path: "/", tags: ["Refunds"],
  summary: "List refunds",
  description: "Retrieves all refunds, optionally filtered by payment or customer.",
  request: { query: z.object({ paymentId: z.string().optional().openapi({ example: "pay_abc123" }) }) },
  responses: { 200: { description: "List of refunds", content: { "application/json": { schema: z.array(z.any()) } } } },
});
refundsController.openapi(listRefundsRoute, async (c) => {
  const handler = c.get("refunds").list;
  const query = c.req.valid("query");
  const result = await handler.handle(query);
  return c.json(result, 200);
});

const getRefundRoute = createRoute({
  method: "get", path: "/{id}", tags: ["Refunds"],
  summary: "Get a refund",
  description: "Retrieves a single refund by ID.",
  request: { params: z.object({ id: z.string().openapi({ example: "ref_abc123" }) }) },
  responses: { 200: { description: "Refund details", content: { "application/json": { schema: z.any() } } } },
});
refundsController.openapi(getRefundRoute, async (c) => {
  const handler = c.get("refunds").get;
  const { id } = c.req.valid("param");
  const result = await handler.handle({ id });
  return c.json(result, 200);
});
