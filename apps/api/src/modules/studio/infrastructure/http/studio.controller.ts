import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createStudioAdminSchema } from "@/modules/studio/application/commands/CreateStudioAdminCommand";
import { updateStudioAdminSchema } from "@/modules/studio/application/commands/UpdateStudioAdminCommand";
import type { AppEnv } from "@/container";

export const studioController = new Hono<AppEnv>();

studioController.post(
  "/",
  zValidator("json", createStudioAdminSchema),
  async (c) => {
    const handler = c.get("studio").createAdmin;
    const dto = c.req.valid("json");
    const result = await handler.handle(dto);
    return c.json(result, 201);
  }
);

studioController.get("/", async (c) => {
  const handler = c.get("studio").listAdmins;
  const result = await handler.handle({});
  return c.json(result, 200);
});

studioController.get("/:idOrEmail", async (c) => {
  const handler = c.get("studio").getAdmin;
  const result = await handler.handle({ idOrEmail: c.req.param("idOrEmail") });
  return c.json(result, 200);
});

studioController.patch(
  "/:id",
  zValidator("json", updateStudioAdminSchema),
  async (c) => {
    const handler = c.get("studio").updateAdmin;
    const dto = c.req.valid("json");
    const result = await handler.handle({ adminId: c.req.param("id"), ...dto });
    return c.json(result, 200);
  }
);
