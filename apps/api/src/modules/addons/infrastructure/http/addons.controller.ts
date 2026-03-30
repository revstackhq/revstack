import { OpenAPIHono } from "@hono/zod-openapi";
import type { AppEnv } from "@/container";
import {
  createAddonRoute,
  bulkCreateAddonsRoute,
  archiveAddonRoute,
  listAddonsRoute,
  getAddonRoute,
} from "./addons.routes";

export const addonsController = new OpenAPIHono<AppEnv>();

// POST /
addonsController.openapi(createAddonRoute, async (c) => {
  const dto = c.req.valid("json");
  const result = await c.get("addons").create.execute(dto);
  return c.json(result, 201);
});

// POST /bulk
addonsController.openapi(bulkCreateAddonsRoute, async (c) => {
  const dto = c.req.valid("json");
  const result = await c.get("addons").createMany.execute(dto);
  return c.json(result, 201);
});

// PATCH /{id}/archive
addonsController.openapi(archiveAddonRoute, async (c) => {
  const { id } = c.req.valid("param");
  const result = await c.get("addons").archive.execute({ id });
  return c.json(result, 200);
});

// GET /
addonsController.openapi(listAddonsRoute, async (c) => {
  const query = c.req.valid("query");
  const result = await c.get("addons").list.execute(query);
  return c.json(result, 200);
});

// GET /{id}
addonsController.openapi(getAddonRoute, async (c) => {
  const { id } = c.req.valid("param");
  const result = await c.get("addons").get.execute({ id });
  return c.json(result, 200);
});
