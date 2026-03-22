import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { processPaymentSchema } from "@/modules/invoices/application/commands/ProcessPaymentCommand";
import type { AppEnv } from "@/container";

export const paymentsController = new Hono<AppEnv>();

paymentsController.post(
  "/",
  zValidator("json", processPaymentSchema),
  async (c) => {
    const handler = c.get("processPaymentHandler");
    const dto = c.req.valid("json");
    
    // Command
    const id = await handler.handle(dto);
    
    return c.json({ id, success: true }, 201);
  }
);
