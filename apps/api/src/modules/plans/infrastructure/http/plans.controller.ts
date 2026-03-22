import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createPlanSchema } from "@/modules/plans/application/commands/CreatePlanCommand";
import type { AppEnv } from "@/container";

export const plansController = new Hono<AppEnv>();

plansController.post(
  "/",
  zValidator("json", createPlanSchema),
  async (c) => {
    const handler = c.get("createPlanHandler");
    const dto = c.req.valid("json");
    
    // Command
    const id = await handler.handle(dto);
    
    return c.json({ id, success: true }, 201);
  }
);

plansController.get("/", async (c) => {
  const handler = c.get("listPlansHandler");
  
  // Fast-path Query
  const result = await handler.handle({});
  
  return c.json(result, 200);
});
