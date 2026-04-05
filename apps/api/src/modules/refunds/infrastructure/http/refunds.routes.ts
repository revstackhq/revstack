import { createRoute, z } from "@hono/zod-openapi";
import { createRefundSchema } from "@/modules/refunds/application/use-cases/CreateRefund";
import { updateRefundSchema } from "@/modules/refunds/application/use-cases/UpdateRefund";

export const createRefundRoute = createRoute({
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

export const updateRefundRoute = createRoute({
  method: "patch", path: "/{id}", tags: ["Refunds"],
  summary: "Update a refund",
  description: "Updates metadata or status of an existing refund.",
  request: {
    params: z.object({ id: z.string().openapi({ example: "ref_abc123" }) }),
    body: { content: { "application/json": { schema: updateRefundSchema } } },
  },
  responses: { 200: { description: "Refund updated", content: { "application/json": { schema: z.any() } } } },
});

export const listRefundsRoute = createRoute({
  method: "get", path: "/", tags: ["Refunds"],
  summary: "List refunds",
  description: "Retrieves all refunds, optionally filtered by payment or customer.",
  request: { query: z.object({ paymentId: z.string().optional().openapi({ example: "pay_abc123" }) }) },
  responses: { 200: { description: "List of refunds", content: { "application/json": { schema: z.array(z.any()) } } } },
});

export const getRefundRoute = createRoute({
  method: "get", path: "/{id}", tags: ["Refunds"],
  summary: "Get a refund",
  description: "Retrieves a single refund by ID.",
  request: { params: z.object({ id: z.string().openapi({ example: "ref_abc123" }) }) },
  responses: { 200: { description: "Refund details", content: { "application/json": { schema: z.any() } } } },
});
