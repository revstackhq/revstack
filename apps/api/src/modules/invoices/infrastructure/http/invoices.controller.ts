import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { createInvoiceSchema } from "@/modules/invoices/application/use-cases/CreateDraftInvoice/CreateDraftInvoice.schema";
import { updateInvoiceSchema } from "@/modules/invoices/application/use-cases/UpdateInvoice/UpdateInvoice.schema";
import { addInvoiceLineItemSchema } from "@/modules/invoices/application/use-cases/AddInvoiceLineItem/AddInvoiceLineItem.schema";
import { updateInvoiceLineItemSchema } from "@/modules/invoices/application/use-cases/UpdateInvoiceLineItem/UpdateInvoiceLineItem.schema";
import type { AppEnv } from "@/container";

export const invoicesController = new OpenAPIHono<AppEnv>();

const createDraftRoute = createRoute({
  method: "post", path: "/", tags: ["Invoices"],
  summary: "Create a draft invoice",
  description: "Creates a new invoice in draft status for a customer.",
  request: { body: { content: { "application/json": { schema: createInvoiceSchema } } } },
  responses: {
    201: { description: "Draft invoice created", content: { "application/json": { schema: z.object({ id: z.string(), success: z.boolean() }) } } },
    400: { description: "Validation error" },
  },
});
invoicesController.openapi(createDraftRoute, async (c) => {
  const handler = c.get("invoices").createDraft;
  const dto = c.req.valid("json");
  const id = await handler.execute(dto);
  return c.json({ id, success: true }, 201);
});

const listInvoicesRoute = createRoute({
  method: "get", path: "/", tags: ["Invoices"],
  summary: "List invoices",
  description: "Retrieves invoices, optionally filtered by customer.",
  request: { query: z.object({ customerId: z.string().optional().openapi({ example: "cust_abc123" }) }) },
  responses: { 200: { description: "List of invoices", content: { "application/json": { schema: z.array(z.any()) } } } },
});
invoicesController.openapi(listInvoicesRoute, async (c) => {
  const handler = c.get("invoices").list;
  const { customerId } = c.req.valid("query");
  const result = await handler.execute({ customerId });
  return c.json(result, 200);
});

const getInvoiceRoute = createRoute({
  method: "get", path: "/{id}", tags: ["Invoices"],
  summary: "Get an invoice",
  description: "Retrieves a single invoice by ID with all line items.",
  request: { params: z.object({ id: z.string().openapi({ example: "inv_abc123" }) }) },
  responses: { 200: { description: "Invoice details", content: { "application/json": { schema: z.any() } } } },
});
invoicesController.openapi(getInvoiceRoute, async (c) => {
  const handler = c.get("invoices").get;
  const { id } = c.req.valid("param");
  const result = await handler.execute({ id });
  return c.json(result, 200);
});

const updateInvoiceRoute = createRoute({
  method: "patch", path: "/{id}", tags: ["Invoices"],
  summary: "Update an invoice",
  description: "Updates mutable fields of a draft invoice.",
  request: {
    params: z.object({ id: z.string().openapi({ example: "inv_abc123" }) }),
    body: { content: { "application/json": { schema: updateInvoiceSchema } } },
  },
  responses: { 200: { description: "Invoice updated", content: { "application/json": { schema: z.any() } } } },
});
invoicesController.openapi(updateInvoiceRoute, async (c) => {
  const handler = c.get("invoices").update;
  const { id } = c.req.valid("param");
  const dto = c.req.valid("json");
  const result = await handler.execute({ id, ...dto });
  return c.json(result, 200);
});

const finalizeInvoiceRoute = createRoute({
  method: "post", path: "/{id}/finalize", tags: ["Invoices"],
  summary: "Finalize an invoice",
  description: "Transitions a draft invoice to finalized status, making it immutable.",
  request: { params: z.object({ id: z.string().openapi({ example: "inv_abc123" }) }) },
  responses: { 200: { description: "Invoice finalized", content: { "application/json": { schema: z.any() } } } },
});
invoicesController.openapi(finalizeInvoiceRoute, async (c) => {
  const handler = c.get("invoices").finalize;
  const { id } = c.req.valid("param");
  const result = await handler.execute({ id });
  return c.json(result, 200);
});

const voidInvoiceRoute = createRoute({
  method: "post", path: "/{id}/void", tags: ["Invoices"],
  summary: "Void an invoice",
  description: "Marks a finalized invoice as void, reversing its financial impact.",
  request: { params: z.object({ id: z.string().openapi({ example: "inv_abc123" }) }) },
  responses: { 200: { description: "Invoice voided", content: { "application/json": { schema: z.any() } } } },
});
invoicesController.openapi(voidInvoiceRoute, async (c) => {
  const handler = c.get("invoices").void;
  const { id } = c.req.valid("param");
  const result = await handler.execute({ id });
  return c.json(result, 200);
});

const addLineItemRoute = createRoute({
  method: "post", path: "/{id}/lines", tags: ["Invoices"],
  summary: "Add a line item",
  description: "Adds a new line item to a draft invoice.",
  request: {
    params: z.object({ id: z.string().openapi({ example: "inv_abc123" }) }),
    body: { content: { "application/json": { schema: addInvoiceLineItemSchema } } },
  },
  responses: { 201: { description: "Line item added", content: { "application/json": { schema: z.any() } } } },
});
invoicesController.openapi(addLineItemRoute, async (c) => {
  const handler = c.get("invoices").addLineItem;
  const { id } = c.req.valid("param");
  const dto = c.req.valid("json");
  const result = await handler.execute({ invoiceId: id, ...dto });
  return c.json(result, 201);
});

const updateLineItemRoute = createRoute({
  method: "patch", path: "/{id}/lines/{lineId}", tags: ["Invoices"],
  summary: "Update a line item",
  description: "Updates an existing line item on a draft invoice.",
  request: {
    params: z.object({ id: z.string().openapi({ example: "inv_abc123" }), lineId: z.string().openapi({ example: "li_abc123" }) }),
    body: { content: { "application/json": { schema: updateInvoiceLineItemSchema } } },
  },
  responses: { 200: { description: "Line item updated", content: { "application/json": { schema: z.any() } } } },
});
invoicesController.openapi(updateLineItemRoute, async (c) => {
  const handler = c.get("invoices").updateLineItem;
  const { id, lineId } = c.req.valid("param");
  const dto = c.req.valid("json");
  const result = await handler.execute({ invoiceId: id, lineId, ...dto });
  return c.json(result, 200);
});

const deleteLineItemRoute = createRoute({
  method: "delete", path: "/{id}/lines/{lineId}", tags: ["Invoices"],
  summary: "Delete a line item",
  description: "Removes a line item from a draft invoice.",
  request: {
    params: z.object({ id: z.string().openapi({ example: "inv_abc123" }), lineId: z.string().openapi({ example: "li_abc123" }) }),
  },
  responses: { 200: { description: "Line item deleted", content: { "application/json": { schema: z.any() } } } },
});
invoicesController.openapi(deleteLineItemRoute, async (c) => {
  const handler = c.get("invoices").deleteLineItem;
  const { id, lineId } = c.req.valid("param");
  const result = await handler.execute({ invoiceId: id, lineId });
  return c.json(result, 200);
});
