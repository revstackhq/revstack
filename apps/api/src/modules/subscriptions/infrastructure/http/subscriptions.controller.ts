import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createSubscriptionSchema } from "@/modules/subscriptions/application/commands/CreateSubscriptionCommand";
import { updateSubscriptionSchema } from "@/modules/subscriptions/application/commands/UpdateSubscriptionCommand";
import { listSubscriptionsSchema } from "@/modules/subscriptions/application/queries/ListSubscriptionsQuery";
import type { AppEnv } from "@/container";

export const subscriptionsController = new Hono<AppEnv>();

subscriptionsController.post(
  "/",
  zValidator("json", createSubscriptionSchema),
  async (c) => {
    const handler = c.get("subscriptions").create;
    const dto = c.req.valid("json");
    
    const id = await handler.handle(dto);
    
    return c.json({ id, success: true }, 201);
  }
);

subscriptionsController.get("/customer/:customerId", async (c) => {
  const handler = c.get("subscriptions").listCustomerSubscriptions;
  const customerId = c.req.param("customerId");
  
  const result = await handler.handle({ customerId });
  
  return c.json(result, 200);
});

subscriptionsController.get(
  "/",
  zValidator("query", listSubscriptionsSchema),
  async (c) => {
    const handler = c.get("subscriptions").list;
    const query = c.req.valid("query");
    const result = await handler.handle(query);
    return c.json(result, 200);
  }
);

subscriptionsController.get("/:id", async (c) => {
  const handler = c.get("subscriptions").get;
  const result = await handler.handle({ id: c.req.param("id") });
  return c.json(result, 200);
});

subscriptionsController.post("/:id/cancel", async (c) => {
  const handler = c.get("subscriptions").cancel;
  const result = await handler.handle({ id: c.req.param("id") });
  return c.json(result, 200);
});

subscriptionsController.patch(
  "/:id",
  zValidator("json", updateSubscriptionSchema),
  async (c) => {
    const handler = c.get("subscriptions").update;
    const dto = c.req.valid("json");
    const result = await handler.handle({ id: c.req.param("id"), ...dto });
    return c.json(result, 200);
  }
);
