import { OpenAPIHono } from "@hono/zod-openapi";
import type { AppEnv } from "@/container";
import {
  createAddonRoute,
  bulkCreateAddonsRoute,
  archiveAddonRoute,
  listAddonsRoute,
  getAddonRoute,
  listAddonEntitlementsRoute,
  createAddonEntitlementRoute,
  getAddonEntitlementRoute,
  deleteAddonEntitlementRoute,
} from "@/modules/addons/infrastructure/http/addons.routes";

export const addonsController = new OpenAPIHono<AppEnv>();

// --- Addon Handlers ---

addonsController.openapi(createAddonRoute, async (c) => {
  const dto = c.req.valid("json");
  const result = await c.get("addons").create.execute(dto);
  return c.json(result, 201);
});

addonsController.openapi(bulkCreateAddonsRoute, async (c) => {
  const dto = c.req.valid("json");
  const result = await c.get("addons").createMany.execute(dto);
  return c.json(result, 201);
});

addonsController.openapi(archiveAddonRoute, async (c) => {
  const { id } = c.req.valid("param");
  const result = await c.get("addons").archive.execute({ id });
  return c.json(result, 200);
});

addonsController.openapi(listAddonsRoute, async (c) => {
  const query = c.req.valid("query");
  const result = await c.get("addons").list.execute(query);
  return c.json(result, 200);
});

addonsController.openapi(getAddonRoute, async (c) => {
  const { id } = c.req.valid("param");
  const result = await c.get("addons").get.execute({ id });
  return c.json(result, 200);
});

// --- Addon Entitlement Handlers (nested under /:addonId/entitlements) ---

addonsController.openapi(listAddonEntitlementsRoute, async (c) => {
  const { addonId } = c.req.valid("param");
  const query = c.req.valid("query");
  const result = await c.get("addonEntitlements").list.execute({ ...query, addon_id: addonId });
  return c.json(result, 200);
});

addonsController.openapi(createAddonEntitlementRoute, async (c) => {
  const { addonId, featureId } = c.req.valid("param");
  const body = c.req.valid("json");
  const result = await c.get("addonEntitlements").create.execute({ ...body, addon_id: addonId, entitlement_id: featureId });
  return c.json(result, 200);
});

addonsController.openapi(getAddonEntitlementRoute, async (c) => {
  const { addonId, featureId } = c.req.valid("param");
  const result = await c.get("addonEntitlements").get.execute({ addon_id: addonId, entitlement_id: featureId });
  return c.json(result, 200);
});

addonsController.openapi(deleteAddonEntitlementRoute, async (c) => {
  const { addonId, featureId } = c.req.valid("param");
  const result = await c.get("addonEntitlements").delete.execute({ addon_id: addonId, entitlement_id: featureId });
  return c.json(result, 200);
});
