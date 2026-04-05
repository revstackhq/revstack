import { createRoute, z } from "@hono/zod-openapi";
import { createInvoiceSchema } from "@/modules/invoices/application/use-cases/CreateDraftInvoice";
import { updateInvoiceSchema } from "@/modules/invoices/application/use-cases/UpdateInvoice";
import { addInvoiceLineItemSchema } from "@/modules/invoices/application/use-cases/AddInvoiceLineItem";
import { updateInvoiceLineItemSchema } from "@/modules/invoices/application/use-cases/UpdateInvoiceLineItem";
import { CreateCreditNoteCommandSchema } from "@/modules/invoices/application/use-cases/CreateCreditNote";
import { ListCreditNotesQuerySchema } from "@/modules/invoices/application/use-cases/ListCreditNotes";

// --- Invoice Routes ---

export const createDraftRoute = createRoute({
  method: "post", path: "/", tags: ["Invoices"],
  summary: "Create a draft invoice",
  description: "Creates a new invoice in draft status for a customer.",
  request: { body: { content: { "application/json": { schema: createInvoiceSchema } } } },
  responses: {
    201: { description: "Draft invoice created", content: { "application/json": { schema: z.object({ id: z.string(), success: z.boolean() }) } } },
    400: { description: "Validation error" },
  },
});

export const listInvoicesRoute = createRoute({
  method: "get", path: "/", tags: ["Invoices"],
  summary: "List invoices",
  description: "Retrieves invoices, optionally filtered by customer.",
  request: { query: z.object({ customerId: z.string().optional().openapi({ example: "cust_abc123" }) }) },
  responses: { 200: { description: "List of invoices", content: { "application/json": { schema: z.array(z.any()) } } } },
});

export const getInvoiceRoute = createRoute({
  method: "get", path: "/{id}", tags: ["Invoices"],
  summary: "Get an invoice",
  description: "Retrieves a single invoice by ID with all line items.",
  request: { params: z.object({ id: z.string().openapi({ example: "inv_abc123" }) }) },
  responses: { 200: { description: "Invoice details", content: { "application/json": { schema: z.any() } } } },
});

export const updateInvoiceRoute = createRoute({
  method: "patch", path: "/{id}", tags: ["Invoices"],
  summary: "Update an invoice",
  description: "Updates mutable fields of a draft invoice.",
  request: {
    params: z.object({ id: z.string().openapi({ example: "inv_abc123" }) }),
    body: { content: { "application/json": { schema: updateInvoiceSchema } } },
  },
  responses: { 200: { description: "Invoice updated", content: { "application/json": { schema: z.any() } } } },
});

export const finalizeInvoiceRoute = createRoute({
  method: "post", path: "/{id}/finalize", tags: ["Invoices"],
  summary: "Finalize an invoice",
  description: "Transitions a draft invoice to finalized status, making it immutable.",
  request: { params: z.object({ id: z.string().openapi({ example: "inv_abc123" }) }) },
  responses: { 200: { description: "Invoice finalized", content: { "application/json": { schema: z.any() } } } },
});

export const voidInvoiceRoute = createRoute({
  method: "post", path: "/{id}/void", tags: ["Invoices"],
  summary: "Void an invoice",
  description: "Marks a finalized invoice as void, reversing its financial impact.",
  request: { params: z.object({ id: z.string().openapi({ example: "inv_abc123" }) }) },
  responses: { 200: { description: "Invoice voided", content: { "application/json": { schema: z.any() } } } },
});

// --- Line Item Routes ---

export const addLineItemRoute = createRoute({
  method: "post", path: "/{id}/lines", tags: ["Invoices"],
  summary: "Add a line item",
  description: "Adds a new line item to a draft invoice.",
  request: {
    params: z.object({ id: z.string().openapi({ example: "inv_abc123" }) }),
    body: { content: { "application/json": { schema: addInvoiceLineItemSchema } } },
  },
  responses: { 201: { description: "Line item added", content: { "application/json": { schema: z.any() } } } },
});

export const updateLineItemRoute = createRoute({
  method: "patch", path: "/{id}/lines/{lineId}", tags: ["Invoices"],
  summary: "Update a line item",
  description: "Updates an existing line item on a draft invoice.",
  request: {
    params: z.object({ id: z.string().openapi({ example: "inv_abc123" }), lineId: z.string().openapi({ example: "li_abc123" }) }),
    body: { content: { "application/json": { schema: updateInvoiceLineItemSchema } } },
  },
  responses: { 200: { description: "Line item updated", content: { "application/json": { schema: z.any() } } } },
});

export const deleteLineItemRoute = createRoute({
  method: "delete", path: "/{id}/lines/{lineId}", tags: ["Invoices"],
  summary: "Delete a line item",
  description: "Removes a line item from a draft invoice.",
  request: {
    params: z.object({ id: z.string().openapi({ example: "inv_abc123" }), lineId: z.string().openapi({ example: "li_abc123" }) }),
  },
  responses: { 200: { description: "Line item deleted", content: { "application/json": { schema: z.any() } } } },
});

// --- Credit Note Routes ---

export const createCreditNoteRoute = createRoute({
  method: "post",
  path: "/{invoiceId}/credit-notes",
  tags: ["Credit Notes"],
  summary: "Create a credit note",
  description: "Issues a credit note against an invoice for partial or full refund.",
  request: {
    params: z.object({ invoiceId: z.string().openapi({ example: "inv_abc123" }) }),
    body: { content: { "application/json": { schema: CreateCreditNoteCommandSchema } } },
  },
  responses: {
    201: { description: "Credit note created", content: { "application/json": { schema: z.any() } } },
    400: { description: "Validation error" },
  },
});

export const listCreditNotesRoute = createRoute({
  method: "get",
  path: "/{invoiceId}/credit-notes",
  tags: ["Credit Notes"],
  summary: "List credit notes",
  description: "Retrieves credit notes for a specific invoice.",
  request: {
    params: z.object({ invoiceId: z.string().openapi({ example: "inv_abc123" }) }),
    query: ListCreditNotesQuerySchema,
  },
  responses: { 200: { description: "List of credit notes", content: { "application/json": { schema: z.array(z.any()) } } } },
});

export const getCreditNoteRoute = createRoute({
  method: "get",
  path: "/{invoiceId}/credit-notes/{id}",
  tags: ["Credit Notes"],
  summary: "Get a credit note",
  description: "Retrieves a single credit note by ID.",
  request: {
    params: z.object({
      invoiceId: z.string().openapi({ example: "inv_abc123" }),
      id: z.string().openapi({ example: "cn_abc123" }),
    }),
  },
  responses: { 200: { description: "Credit note details", content: { "application/json": { schema: z.any() } } } },
});
