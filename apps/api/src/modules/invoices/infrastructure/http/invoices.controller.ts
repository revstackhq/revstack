import { OpenAPIHono } from "@hono/zod-openapi";
import type { AppEnv } from "@/container";
import {
  createDraftRoute,
  listInvoicesRoute,
  getInvoiceRoute,
  updateInvoiceRoute,
  finalizeInvoiceRoute,
  voidInvoiceRoute,
  addLineItemRoute,
  updateLineItemRoute,
  deleteLineItemRoute,
  createCreditNoteRoute,
  listCreditNotesRoute,
  getCreditNoteRoute,
} from "@/modules/invoices/infrastructure/http/invoices.routes";

export const invoicesController = new OpenAPIHono<AppEnv>();

// --- Invoice Handlers ---

invoicesController.openapi(createDraftRoute, async (c) => {
  const handler = c.get("invoices").createDraft;
  const dto = c.req.valid("json");
  const id = await handler.execute(dto);
  return c.json({ id, success: true }, 201);
});

invoicesController.openapi(listInvoicesRoute, async (c) => {
  const handler = c.get("invoices").list;
  const { customerId } = c.req.valid("query");
  const result = await handler.execute({ customerId });
  return c.json(result, 200);
});

invoicesController.openapi(getInvoiceRoute, async (c) => {
  const handler = c.get("invoices").get;
  const { id } = c.req.valid("param");
  const result = await handler.execute({ id });
  return c.json(result, 200);
});

invoicesController.openapi(updateInvoiceRoute, async (c) => {
  const handler = c.get("invoices").update;
  const { id } = c.req.valid("param");
  const dto = c.req.valid("json");
  const result = await handler.execute({ id, ...dto });
  return c.json(result, 200);
});

invoicesController.openapi(finalizeInvoiceRoute, async (c) => {
  const handler = c.get("invoices").finalize;
  const { id } = c.req.valid("param");
  const result = await handler.execute({ id });
  return c.json(result, 200);
});

invoicesController.openapi(voidInvoiceRoute, async (c) => {
  const handler = c.get("invoices").void;
  const { id } = c.req.valid("param");
  const result = await handler.execute({ id });
  return c.json(result, 200);
});

// --- Line Item Handlers ---

invoicesController.openapi(addLineItemRoute, async (c) => {
  const handler = c.get("invoices").addLineItem;
  const { id } = c.req.valid("param");
  const dto = c.req.valid("json");
  const result = await handler.execute({ invoiceId: id, ...dto });
  return c.json(result, 201);
});

invoicesController.openapi(updateLineItemRoute, async (c) => {
  const handler = c.get("invoices").updateLineItem;
  const { id, lineId } = c.req.valid("param");
  const dto = c.req.valid("json");
  const result = await handler.execute({ invoiceId: id, lineId, ...dto });
  return c.json(result, 200);
});

invoicesController.openapi(deleteLineItemRoute, async (c) => {
  const handler = c.get("invoices").deleteLineItem;
  const { id, lineId } = c.req.valid("param");
  const result = await handler.execute({ invoiceId: id, lineId });
  return c.json(result, 200);
});

// --- Credit Note Handlers ---

invoicesController.openapi(createCreditNoteRoute, async (c) => {
  const handler = c.get("creditNotes").create;
  const { invoiceId } = c.req.valid("param");
  const dto = c.req.valid("json");
  const result = await handler.execute({ invoiceId, ...dto });
  return c.json(result, 201);
});

invoicesController.openapi(listCreditNotesRoute, async (c) => {
  const handler = c.get("creditNotes").list;
  const { invoiceId } = c.req.valid("param");
  const query = c.req.valid("query");
  const result = await handler.execute({ invoiceId, ...query });
  return c.json(result, 200);
});

invoicesController.openapi(getCreditNoteRoute, async (c) => {
  const handler = c.get("creditNotes").get;
  const { invoiceId, id } = c.req.valid("param");
  const result = await handler.execute({ invoiceId, id });
  return c.json(result, 200);
});
