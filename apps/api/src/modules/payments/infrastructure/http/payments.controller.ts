import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { processPaymentSchema } from "@/modules/payments/application/commands/ProcessPaymentCommand";
import { listPaymentsSchema } from "@/modules/payments/application/queries/ListPaymentsQuery";
import type { AppEnv } from "@/container";

export const paymentsController = new Hono<AppEnv>();

paymentsController.post(
  "/",
  zValidator("json", processPaymentSchema),
  async (c) => {
    const handler = c.get("payments").process;
    const dto = c.req.valid("json");
    
    // Command
    const id = await handler.handle(dto);
    
    return c.json({ id, success: true }, 201);
  }
);

paymentsController.get(
  "/",
  zValidator("query", listPaymentsSchema),
  async (c) => {
    const handler = c.get("payments").list;
    const query = c.req.valid("query");
    
    const result = await handler.handle(query);
    return c.json(result, 200);
  }
);

paymentsController.get("/:id", async (c) => {
  const handler = c.get("payments").get;
  const result = await handler.handle({ id: c.req.param("id") });
  return c.json(result, 200);
});
