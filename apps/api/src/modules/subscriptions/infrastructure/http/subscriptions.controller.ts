import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { createSubscriptionSchema } from "@/modules/subscriptions/application/commands/CreateSubscriptionCommand";
import { updateSubscriptionSchema } from "@/modules/subscriptions/application/commands/UpdateSubscriptionCommand";
import { listSubscriptionsSchema } from "@/modules/subscriptions/application/queries/ListSubscriptionsQuery";
import type { AppEnv } from "@/container";

export const subscriptionsController = new OpenAPIHono<AppEnv>();

const createSubscriptionRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["Subscriptions"],
  summary: "Create a subscription",
  description: "Creates a new subscription linking a customer to a plan and price.",
  request: {
    body: { content: { "application/json": { schema: createSubscriptionSchema } } },
  },
  responses: {
    201: {
      description: "Subscription created",
      content: { "application/json": { schema: z.object({ id: z.string(), success: z.boolean() }) } },
    },
    400: { description: "Validation error" },
    409: { description: "Duplicate subscription conflict" },
  },
});

subscriptionsController.openapi(createSubscriptionRoute, async (c) => {
  const handler = c.get("subscriptions").create;
  const dto = c.req.valid("json");
  const id = await handler.handle(dto);
  return c.json({ id, success: true }, 201);
});

const listCustomerSubscriptionsRoute = createRoute({
  method: "get",
  path: "/customer/{customerId}",
  tags: ["Subscriptions"],
  summary: "List customer subscriptions",
  description: "Retrieves all subscriptions for a specific customer.",
  request: {
    params: z.object({ customerId: z.string().openapi({ example: "cust_abc123" }) }),
  },
  responses: {
    200: {
      description: "Customer subscriptions",
      content: { "application/json": { schema: z.array(z.any()) } },
    },
  },
});

subscriptionsController.openapi(listCustomerSubscriptionsRoute, async (c) => {
  const handler = c.get("subscriptions").listCustomerSubscriptions;
  const { customerId } = c.req.valid("param");
  const result = await handler.handle({ customerId });
  return c.json(result, 200);
});

const listSubscriptionsRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Subscriptions"],
  summary: "List subscriptions",
  description: "Retrieves subscriptions with optional filtering.",
  request: {
    query: listSubscriptionsSchema,
  },
  responses: {
    200: {
      description: "List of subscriptions",
      content: { "application/json": { schema: z.array(z.any()) } },
    },
  },
});

subscriptionsController.openapi(listSubscriptionsRoute, async (c) => {
  const handler = c.get("subscriptions").list;
  const query = c.req.valid("query");
  const result = await handler.handle(query);
  return c.json(result, 200);
});

const getSubscriptionRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["Subscriptions"],
  summary: "Get a subscription",
  description: "Retrieves a single subscription by ID.",
  request: {
    params: z.object({ id: z.string().openapi({ example: "sub_abc123" }) }),
  },
  responses: {
    200: {
      description: "Subscription details",
      content: { "application/json": { schema: z.any() } },
    },
  },
});

subscriptionsController.openapi(getSubscriptionRoute, async (c) => {
  const handler = c.get("subscriptions").get;
  const { id } = c.req.valid("param");
  const result = await handler.handle({ id });
  return c.json(result, 200);
});

const cancelSubscriptionRoute = createRoute({
  method: "post",
  path: "/{id}/cancel",
  tags: ["Subscriptions"],
  summary: "Cancel a subscription",
  description: "Cancels an active subscription, optionally at end of billing period.",
  request: {
    params: z.object({ id: z.string().openapi({ example: "sub_abc123" }) }),
  },
  responses: {
    200: {
      description: "Subscription cancelled",
      content: { "application/json": { schema: z.any() } },
    },
  },
});

subscriptionsController.openapi(cancelSubscriptionRoute, async (c) => {
  const handler = c.get("subscriptions").cancel;
  const { id } = c.req.valid("param");
  const result = await handler.handle({ id });
  return c.json(result, 200);
});

const updateSubscriptionRoute = createRoute({
  method: "patch",
  path: "/{id}",
  tags: ["Subscriptions"],
  summary: "Update a subscription",
  description: "Updates mutable fields of an existing subscription.",
  request: {
    params: z.object({ id: z.string().openapi({ example: "sub_abc123" }) }),
    body: { content: { "application/json": { schema: updateSubscriptionSchema } } },
  },
  responses: {
    200: {
      description: "Subscription updated",
      content: { "application/json": { schema: z.any() } },
    },
  },
});

subscriptionsController.openapi(updateSubscriptionRoute, async (c) => {
  const handler = c.get("subscriptions").update;
  const { id } = c.req.valid("param");
  const dto = c.req.valid("json");
  const result = await handler.handle({ id, ...dto });
  return c.json(result, 200);
});
