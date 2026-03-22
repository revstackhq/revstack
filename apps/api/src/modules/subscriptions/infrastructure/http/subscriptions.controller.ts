import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createSubscriptionSchema } from "@/modules/subscriptions/application/commands/CreateSubscriptionCommand";
import type { AppEnv } from "@/container";

export const subscriptionsController = new Hono<AppEnv>();

subscriptionsController.post(
  "/",
  zValidator("json", createSubscriptionSchema),
  async (c) => {
    const handler = c.get("createSubscriptionHandler");
    const dto = c.req.valid("json");
    
    const id = await handler.handle(dto);
    
    return c.json({ id, success: true }, 201);
  }
);

subscriptionsController.get("/customer/:customerId", async (c) => {
  const handler = c.get("listCustomerSubscriptionsHandler");
  const customerId = c.req.param("customerId");
  
  const result = await handler.handle({ customerId });
  
  return c.json(result, 200);
});
