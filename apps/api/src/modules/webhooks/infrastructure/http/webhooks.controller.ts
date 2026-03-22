import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createWebhookEndpointSchema } from "@/modules/webhooks/application/commands/CreateWebhookEndpointCommand";
import type { AppEnv } from "@/container";

export const webhooksController = new Hono<AppEnv>();

webhooksController.post(
  "/endpoints",
  zValidator("json", createWebhookEndpointSchema),
  async (c) => {
    const handler = c.get("createWebhookEndpointHandler");
    const dto = c.req.valid("json");
    
    // Command
    const id = await handler.handle(dto);
    
    return c.json({ id, success: true }, 201);
  }
);

webhooksController.get("/endpoints", async (c) => {
  const handler = c.get("listWebhookEndpointsHandler");
  
  // Fast-path Query
  const result = await handler.handle({});
  
  return c.json(result, 200);
});
