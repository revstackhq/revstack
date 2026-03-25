import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { recordUsageSchema } from "@/modules/usage/application/commands/RecordUsageCommand";
import { createUsageMeterSchema } from "@/modules/usage/application/commands/CreateUsageMeterCommand";
import { updateUsageMeterSchema } from "@/modules/usage/application/commands/UpdateUsageMeterCommand";
import { listUsagesSchema } from "@/modules/usage/application/queries/ListUsagesQuery";
import type { AppEnv } from "@/container";

export const usageController = new Hono<AppEnv>();

usageController.post(
  "/record",
  zValidator("json", recordUsageSchema),
  async (c) => {
    const handler = c.get("usage").record;
    const dto = c.req.valid("json");
    
    // Command
    const id = await handler.handle(dto);
    
    return c.json({ id, success: true }, 200);
  }
);

usageController.get("/meters/:customerId/:featureId", async (c) => {
  const handler = c.get("usage").getMeter;
  const customerId = c.req.param("customerId");
  const featureId = c.req.param("featureId");
  
  // Fast-path Query
  const result = await handler.handle({ customerId, featureId });
  
  return c.json(result, 200);
});

usageController.get(
  "/",
  zValidator("query", listUsagesSchema),
  async (c) => {
    const handler = c.get("usage").list;
    const query = c.req.valid("query");
    const result = await handler.handle(query);
    return c.json(result, 200);
  }
);

usageController.post(
  "/meters",
  zValidator("json", createUsageMeterSchema),
  async (c) => {
    const handler = c.get("usage").createMeter;
    const dto = c.req.valid("json");
    const result = await handler.handle(dto);
    return c.json(result, 201);
  }
);

usageController.patch(
  "/meters/:id",
  zValidator("json", updateUsageMeterSchema),
  async (c) => {
    const handler = c.get("usage").updateMeter;
    const dto = c.req.valid("json");
    const result = await handler.handle({ id: c.req.param("id"), ...dto });
    return c.json(result, 200);
  }
);
