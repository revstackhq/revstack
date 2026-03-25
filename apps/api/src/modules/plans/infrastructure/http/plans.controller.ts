import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createPlanSchema } from "@/modules/plans/application/commands/CreatePlanCommand";
import type { AppEnv } from "@/container";

export const plansController = new Hono<AppEnv>();

plansController.post(
  "/",
  zValidator("json", createPlanSchema),
  async (c) => {
    const handler = c.get("plans").create;
    const dto = c.req.valid("json");
    const id = await handler.handle(dto);
    return c.json({ id, success: true }, 201);
  },
);

plansController.get("/", async (c) => {
  const handler = c.get("plans").list;
  const result = await handler.handle({});
  return c.json(result, 200);
});

plansController.patch("/:id/archive", async (c) => {
  const handler = c.get("plans").archive;
  await handler.handle({ id: c.req.param("id") });
  return c.json({ success: true, message: "Plan archived successfully" }, 200);
});

plansController.patch("/:id/hide", async (c) => {
  const handler = c.get("plans").hide;
  await handler.handle({ id: c.req.param("id") });
  return c.json({ success: true, message: "Plan hidden successfully" }, 200);
});

