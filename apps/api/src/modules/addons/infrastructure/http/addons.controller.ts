import { OpenAPIHono } from "@hono/zod-openapi";
import type { AppEnv } from "@/container";
import {
  createAddonRoute,
  listAddonsRoute,
  getAddonRoute,
  archiveAddonRoute,
  createAddonEntitlementRoute,
  deleteAddonEntitlementRoute,
  updateAddonRoute,
} from "@/modules/addons/infrastructure/http/addons.routes";

export const addonsController = new OpenAPIHono<AppEnv>();

addonsController.openapi(createAddonRoute, async (c) => {
  const body = c.req.valid("json");
  const environmentId = c.get("environmentId");

  const result = await c
    .get("addons")
    .create.execute({ ...body, environment_id: environmentId });

  return c.json(result, 201);
});

addonsController.openapi(listAddonsRoute, async (c) => {
  const query = c.req.valid("query");
  const environmentId = c.get("environmentId");

  const result = await c
    .get("addons")
    .list.execute({ ...query, environment_id: environmentId });

  return c.json(result, 200);
});

addonsController.openapi(getAddonRoute, async (c) => {
  const { id_or_slug } = c.req.valid("param");
  const environmentId = c.get("environmentId");

  const result = await c
    .get("addons")
    .get.execute({ id_or_slug, environment_id: environmentId });

  return c.json(result, 200);
});

addonsController.openapi(archiveAddonRoute, async (c) => {
  const { id } = c.req.valid("param");
  const environmentId = c.get("environmentId");

  const result = await c
    .get("addons")
    .archive.execute({ id, environment_id: environmentId });

  return c.json(result, 200);
});

addonsController.openapi(updateAddonRoute, async (c) => {
  const { id } = c.req.valid("param");
  const body = c.req.valid("json");
  const environmentId = c.get("environmentId");

  const result = await c
    .get("addons")
    .update.execute({ ...body, id, environment_id: environmentId });

  return c.json(result, 200);
});

addonsController.openapi(createAddonEntitlementRoute, async (c) => {
  const { addon_id, entitlement_id } = c.req.valid("param");
  const body = c.req.valid("json");
  const environmentId = c.get("environmentId");

  const result = await c.get("addons").upsertEntitlement.execute({
    ...body,
    addon_id,
    entitlement_id,
    environment_id: environmentId,
  });

  return c.json(result, 200);
});

addonsController.openapi(deleteAddonEntitlementRoute, async (c) => {
  const { addon_id, entitlement_id } = c.req.valid("param");
  const environmentId = c.get("environmentId");

  const result = await c.get("addons").removeEntitlement.execute({
    addon_id,
    entitlement_id,
    environment_id: environmentId,
  });

  return c.json(result, 200);
});
