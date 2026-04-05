import { createRoute, z } from "@hono/zod-openapi";
import { createSubscriptionSchema } from "@/modules/subscriptions/application/use-cases/CreateSubscription";
import { updateSubscriptionSchema } from "@/modules/subscriptions/application/use-cases/UpdateSubscription";
import { listSubscriptionsSchema } from "@/modules/subscriptions/application/use-cases/ListSubscriptions";

export const createSubscriptionRoute = createRoute({
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

export const listCustomerSubscriptionsRoute = createRoute({
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

export const listSubscriptionsRoute = createRoute({
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

export const getSubscriptionRoute = createRoute({
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

export const cancelSubscriptionRoute = createRoute({
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

export const updateSubscriptionRoute = createRoute({
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
