import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createEnvironmentSchema } from "@/modules/environments/application/commands/CreateEnvironmentCommand";
import { updateEnvironmentSchema } from "@/modules/environments/application/commands/UpdateEnvironmentCommand";
import type { AppEnv } from "@/container";

export const environmentsController = new Hono<AppEnv>();

environmentsController.post(
  "/",
  zValidator("json", createEnvironmentSchema),
  async (c) => {
    const handler = c.get("environments").create;
    const dto = c.req.valid("json");
    const result = await handler.handle(dto);
    return c.json(result, 201);
  }
);

environmentsController.get("/:id", async (c) => {
  const handler = c.get("environments").get;
  const result = await handler.handle({ environmentId: c.req.param("id") });
  return c.json(result, 200);
});

environmentsController.patch(
  "/:id",
  zValidator("json", updateEnvironmentSchema),
  async (c) => {
    const handler = c.get("environments").update;
    const dto = c.req.valid("json");
    const result = await handler.handle({ environmentId: c.req.param("id"), ...dto });
    return c.json(result, 200);
  }
);

environmentsController.delete("/:id", async (c) => {
  const handler = c.get("environments").delete;
  await handler.handle({ environmentId: c.req.param("id") });
  return c.json({ success: true, message: "Environment deleted successfully" }, 200);
});
