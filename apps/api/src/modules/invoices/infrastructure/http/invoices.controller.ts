import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createInvoiceSchema } from "@/modules/invoices/application/commands/CreateDraftInvoiceCommand";
import { updateInvoiceSchema } from "@/modules/invoices/application/commands/UpdateInvoiceCommand";
import { addInvoiceLineItemSchema } from "@/modules/invoices/application/commands/AddInvoiceLineItemCommand";
import { updateInvoiceLineItemSchema } from "@/modules/invoices/application/commands/UpdateInvoiceLineItemCommand";
import type { AppEnv } from "@/container";

export const invoicesController = new Hono<AppEnv>();

invoicesController.post(
  "/",
  zValidator("json", createInvoiceSchema),
  async (c) => {
    const handler = c.get("invoices").createDraft;
    const dto = c.req.valid("json");
    
    // Command
    const id = await handler.handle(dto);
    
    return c.json({ id, success: true }, 201);
  }
);

invoicesController.get("/", async (c) => {
  const handler = c.get("invoices").list;
  const customerId = c.req.query("customerId");
  
  // Fast-path Query
  const result = await handler.handle({ customerId });
  
  return c.json(result, 200);
});

invoicesController.get("/:id", async (c) => {
  const handler = c.get("invoices").get;
  const result = await handler.handle({ id: c.req.param("id") });
  return c.json(result, 200);
});

invoicesController.patch(
  "/:id",
  zValidator("json", updateInvoiceSchema),
  async (c) => {
    const handler = c.get("invoices").update;
    const dto = c.req.valid("json");
    const result = await handler.handle({ id: c.req.param("id"), ...dto });
    return c.json(result, 200);
  }
);

invoicesController.post("/:id/finalize", async (c) => {
  const handler = c.get("invoices").finalize;
  const result = await handler.handle({ id: c.req.param("id") });
  return c.json(result, 200);
});

invoicesController.post("/:id/void", async (c) => {
  const handler = c.get("invoices").void;
  const result = await handler.handle({ id: c.req.param("id") });
  return c.json(result, 200);
});

invoicesController.post(
  "/:id/lines",
  zValidator("json", addInvoiceLineItemSchema),
  async (c) => {
    const handler = c.get("invoices").addLineItem;
    const dto = c.req.valid("json");
    const result = await handler.handle({ invoiceId: c.req.param("id"), ...dto });
    return c.json(result, 201);
  }
);

invoicesController.patch(
  "/:id/lines/:lineId",
  zValidator("json", updateInvoiceLineItemSchema),
  async (c) => {
    const handler = c.get("invoices").updateLineItem;
    const dto = c.req.valid("json");
    const result = await handler.handle({ invoiceId: c.req.param("id"), lineId: c.req.param("lineId"), ...dto });
    return c.json(result, 200);
  }
);

invoicesController.delete("/:id/lines/:lineId", async (c) => {
  const handler = c.get("invoices").deleteLineItem;
  const result = await handler.handle({ invoiceId: c.req.param("id"), lineId: c.req.param("lineId") });
  return c.json(result, 200);
});
