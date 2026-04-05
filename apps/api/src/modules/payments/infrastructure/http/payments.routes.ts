import { createRoute, z } from "@hono/zod-openapi";
import { processPaymentSchema } from "@/modules/payments/application/use-cases/ProcessPayment";

export const processPaymentRoute = createRoute({
  method: "post", path: "/", tags: ["Payments"],
  summary: "Process a payment",
  description: "Processes a payment against an invoice. Supports idempotency keys to prevent duplicate charges.",
  request: { body: { content: { "application/json": { schema: processPaymentSchema } } } },
  responses: {
    201: { description: "Payment processed", content: { "application/json": { schema: z.any() } } },
    400: { description: "Validation error" },
    409: { description: "Idempotency conflict" },
  },
});

export const listPaymentsRoute = createRoute({
  method: "get", path: "/", tags: ["Payments"],
  summary: "List payments",
  description: "Retrieves all payments, optionally filtered by invoice or customer.",
  request: { query: z.object({ invoiceId: z.string().optional().openapi({ example: "inv_abc123" }), customerId: z.string().optional().openapi({ example: "cust_abc123" }) }) },
  responses: { 200: { description: "List of payments", content: { "application/json": { schema: z.array(z.any()) } } } },
});

export const getPaymentRoute = createRoute({
  method: "get", path: "/{id}", tags: ["Payments"],
  summary: "Get a payment",
  description: "Retrieves a single payment by ID.",
  request: { params: z.object({ id: z.string().openapi({ example: "pay_abc123" }) }) },
  responses: { 200: { description: "Payment details", content: { "application/json": { schema: z.any() } } } },
});
