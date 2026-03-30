import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { createWebhookEndpointSchema } from "@/modules/webhooks/application/use-cases/CreateWebhookEndpoint/CreateWebhookEndpoint.schema";
import type { AppEnv } from "@/container";

export const webhooksController = new OpenAPIHono<AppEnv>();

const createEndpointRoute = createRoute({
  method: "post",
  path: "/endpoints",
  tags: ["Webhooks"],
  summary: "Create a webhook endpoint",
  description:
    "Registers a new webhook endpoint URL to receive event notifications.",
  request: {
    body: {
      content: { "application/json": { schema: createWebhookEndpointSchema } },
    },
  },
  responses: {
    201: {
      description: "Webhook endpoint created",
      content: {
        "application/json": {
          schema: z.object({ id: z.string(), success: z.boolean() }),
        },
      },
    },
  },
});

webhooksController.openapi(createEndpointRoute, async (c) => {
  const handler = c.get("webhooks").createEndpoint;
  const dto = c.req.valid("json");
  const id = await handler.execute(dto);
  return c.json({ id, success: true }, 201);
});

const listEndpointsRoute = createRoute({
  method: "get",
  path: "/endpoints",
  tags: ["Webhooks"],
  summary: "List webhook endpoints",
  description: "Retrieves all registered webhook endpoints.",
  responses: {
    200: {
      description: "List of endpoints",
      content: { "application/json": { schema: z.array(z.any()) } },
    },
  },
});

webhooksController.openapi(listEndpointsRoute, async (c) => {
  const handler = c.get("webhooks").listEndpoints;
  const result = await handler.execute({});
  return c.json(result, 200);
});

const deactivateEndpointRoute = createRoute({
  method: "post",
  path: "/{id}/deactivate",
  tags: ["Webhooks"],
  summary: "Deactivate a webhook endpoint",
  description:
    "Disables a webhook endpoint from receiving further notifications.",
  request: {
    params: z.object({ id: z.string().openapi({ example: "wh_abc123" }) }),
  },
  responses: {
    200: {
      description: "Endpoint deactivated",
      content: { "application/json": { schema: z.any() } },
    },
  },
});
webhooksController.openapi(deactivateEndpointRoute, async (c) => {
  const handler = c.get("webhooks").deactivateEndpoint;
  const { id } = c.req.valid("param");
  const result = await handler.execute({ id });
  return c.json(result, 200);
});

const rotateSecretRoute = createRoute({
  method: "post",
  path: "/{id}/rotate",
  tags: ["Webhooks"],
  summary: "Rotate webhook secret",
  description: "Generates a new signing secret for a webhook endpoint.",
  request: {
    params: z.object({ id: z.string().openapi({ example: "wh_abc123" }) }),
  },
  responses: {
    200: {
      description: "Secret rotated",
      content: { "application/json": { schema: z.any() } },
    },
  },
});

webhooksController.openapi(rotateSecretRoute, async (c) => {
  const handler = c.get("webhooks").rotateSecret;
  const { id } = c.req.valid("param");
  const result = await handler.execute({ id });
  return c.json(result, 200);
});

const listDeliveriesRoute = createRoute({
  method: "get",
  path: "/{id}/deliveries",
  tags: ["Webhooks"],
  summary: "List webhook deliveries",
  description: "Retrieves the delivery log for a specific webhook endpoint.",
  request: {
    params: z.object({ id: z.string().openapi({ example: "wh_abc123" }) }),
  },
  responses: {
    200: {
      description: "Delivery logs",
      content: { "application/json": { schema: z.array(z.any()) } },
    },
  },
});

webhooksController.openapi(listDeliveriesRoute, async (c) => {
  const handler = c.get("webhooks").listDeliveries;
  const { id } = c.req.valid("param");
  const result = await handler.execute({ endpointId: id });
  return c.json(result, 200);
});
