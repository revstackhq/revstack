import { OpenAPIHono } from "@hono/zod-openapi";
import type { AppEnv } from "@/container";
import {
  createEndpointRoute,
  listEndpointsRoute,
  deactivateEndpointRoute,
  rotateSecretRoute,
  listDeliveriesRoute,
} from "@/modules/webhooks/infrastructure/http/webhooks.routes";

export const webhooksController = new OpenAPIHono<AppEnv>();


webhooksController.openapi(createEndpointRoute, async (c) => {
  const handler = c.get("webhooks").createEndpoint;
  const dto = c.req.valid("json");
  const id = await handler.execute(dto);
  return c.json({ id, success: true }, 201);
});

webhooksController.openapi(listEndpointsRoute, async (c) => {
  const handler = c.get("webhooks").listEndpoints;
  const result = await handler.execute({});
  return c.json(result, 200);
});

webhooksController.openapi(deactivateEndpointRoute, async (c) => {
  const handler = c.get("webhooks").deactivateEndpoint;
  const { id } = c.req.valid("param");
  const result = await handler.execute({ id });
  return c.json(result, 200);
});

webhooksController.openapi(rotateSecretRoute, async (c) => {
  const handler = c.get("webhooks").rotateSecret;
  const { id } = c.req.valid("param");
  const result = await handler.execute({ id });
  return c.json(result, 200);
});

webhooksController.openapi(listDeliveriesRoute, async (c) => {
  const handler = c.get("webhooks").listDeliveries;
  const { id } = c.req.valid("param");
  const result = await handler.execute({ endpointId: id });
  return c.json(result, 200);
});
