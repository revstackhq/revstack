import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createInvoiceSchema } from "@/modules/invoices/application/commands/CreateDraftInvoiceCommand";
import type { AppEnv } from "@/container";

export const invoicesController = new Hono<AppEnv>();

invoicesController.post(
  "/",
  zValidator("json", createInvoiceSchema),
  async (c) => {
    const handler = c.get("createDraftInvoiceHandler");
    const dto = c.req.valid("json");
    
    // Command
    const id = await handler.handle(dto);
    
    return c.json({ id, success: true }, 201);
  }
);

invoicesController.get("/", async (c) => {
  const handler = c.get("listInvoicesHandler");
  const customerId = c.req.query("customerId");
  
  // Fast-path Query
  const result = await handler.handle({ customerId });
  
  return c.json(result, 200);
});
