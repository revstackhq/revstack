import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { recordUsageSchema } from "@/modules/usage/application/commands/RecordUsageCommand";
import type { AppEnv } from "@/container";

export const usageController = new Hono<AppEnv>();

usageController.post(
  "/record",
  zValidator("json", recordUsageSchema),
  async (c) => {
    const handler = c.get("recordUsageHandler");
    const dto = c.req.valid("json");
    
    // Command
    const id = await handler.handle(dto);
    
    return c.json({ id, success: true }, 200);
  }
);

usageController.get("/meters/:customerId/:featureId", async (c) => {
  const handler = c.get("getUsageMeterHandler");
  const customerId = c.req.param("customerId");
  const featureId = c.req.param("featureId");
  
  // Fast-path Query
  const result = await handler.handle({ customerId, featureId });
  
  return c.json(result, 200);
});
