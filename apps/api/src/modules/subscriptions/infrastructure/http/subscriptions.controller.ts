import { OpenAPIHono } from "@hono/zod-openapi";
import type { AppEnv } from "@/container";
import {
  createSubscriptionRoute,
  listCustomerSubscriptionsRoute,
  listSubscriptionsRoute,
  getSubscriptionRoute,
  cancelSubscriptionRoute,
  updateSubscriptionRoute,
} from "@/modules/subscriptions/infrastructure/http/subscriptions.routes";

export const subscriptionsController = new OpenAPIHono<AppEnv>();


subscriptionsController.openapi(createSubscriptionRoute, async (c) => {
  const handler = c.get("subscriptions").create;
  const dto = c.req.valid("json");
  const id = await handler.execute(dto);
  return c.json({ id, success: true }, 201);
});

subscriptionsController.openapi(listCustomerSubscriptionsRoute, async (c) => {
  const handler = c.get("subscriptions").listCustomerSubscriptions;
  const { customerId } = c.req.valid("param");
  const result = await handler.execute({ customerId });
  return c.json(result, 200);
});

subscriptionsController.openapi(listSubscriptionsRoute, async (c) => {
  const handler = c.get("subscriptions").list;
  const query = c.req.valid("query");
  const result = await handler.execute(query);
  return c.json(result, 200);
});

subscriptionsController.openapi(getSubscriptionRoute, async (c) => {
  const handler = c.get("subscriptions").get;
  const { id } = c.req.valid("param");
  const result = await handler.execute({ id });
  return c.json(result, 200);
});

subscriptionsController.openapi(cancelSubscriptionRoute, async (c) => {
  const handler = c.get("subscriptions").cancel;
  const { id } = c.req.valid("param");
  const result = await handler.execute({ id });
  return c.json(result, 200);
});

subscriptionsController.openapi(updateSubscriptionRoute, async (c) => {
  const handler = c.get("subscriptions").update;
  const { id } = c.req.valid("param");
  const dto = c.req.valid("json");
  const result = await handler.execute({ id, ...dto });
  return c.json(result, 200);
});
