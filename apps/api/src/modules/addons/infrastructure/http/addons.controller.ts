import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createAddonSchema } from "@/modules/addons/application/commands/CreateAddonCommand";
import { createManyAddonsSchema } from "@/modules/addons/application/commands/CreateManyAddonsCommand";
import { listAddonsSchema } from "@/modules/addons/application/queries/ListAddonsQuery";
import type { AppEnv } from "@/container";

export const addonsController = new Hono<AppEnv>();

addonsController.post(
  "/",
  zValidator("json", createAddonSchema),
  async (c) => {
    const handler = c.get("addons").create;
    const dto = c.req.valid("json");
    const result = await handler.handle(dto);
    return c.json(result, 201);
  },
);

addonsController.post(
  "/bulk",
  zValidator("json", createManyAddonsSchema),
  async (c) => {
    const handler = c.get("addons").createMany;
    const dto = c.req.valid("json");
    const result = await handler.handle(dto);
    return c.json(result, 201);
  },
);

addonsController.patch("/:id/archive", async (c) => {
  const handler = c.get("addons").archive;
  await handler.handle({ id: c.req.param("id") });
  return c.json({ success: true, message: "Addon archived successfully" }, 200);
});

addonsController.get(
  "/",
  zValidator("query", listAddonsSchema),
  async (c) => {
    const handler = c.get("addons").list;
    const query = c.req.valid("query");
    const result = await handler.handle(query);
    return c.json(result, 200);
  },
);

addonsController.get("/:id", async (c) => {
  const handler = c.get("addons").get;
  const result = await handler.handle({ id: c.req.param("id") });
  return c.json(result, 200);
});

