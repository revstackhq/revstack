import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createWebhookEndpointSchema } from "@/modules/webhooks/application/commands/CreateWebhookEndpointCommand";
import type { AppEnv } from "@/container";

export const webhooksController = new Hono<AppEnv>();

webhooksController.post(
  "/endpoints",
  zValidator("json", createWebhookEndpointSchema),
  async (c) => {
    const handler = c.get("webhooks").createEndpoint;
    const dto = c.req.valid("json");
    
    // Command
    const id = await handler.handle(dto);
    
    return c.json({ id, success: true }, 201);
  }
);

webhooksController.get("/endpoints", async (c) => {
  const handler = c.get("webhooks").listEndpoints;
  
  // Fast-path Query
  const result = await handler.handle({});
  
  return c.json(result, 200);
});

webhooksController.post("/:id/deactivate", async (c) => {
  const handler = c.get("webhooks").deactivateEndpoint;
  const result = await handler.handle({ id: c.req.param("id") });
  return c.json(result, 200);
});

webhooksController.post("/:id/rotate", async (c) => {
  const handler = c.get("webhooks").rotateSecret;
  const result = await handler.handle({ id: c.req.param("id") });
  return c.json(result, 200);
});

webhooksController.get("/:id/deliveries", async (c) => {
  const handler = c.get("webhooks").listDeliveries;
  const result = await handler.handle({ endpointId: c.req.param("id") });
  return c.json(result, 200);
});

