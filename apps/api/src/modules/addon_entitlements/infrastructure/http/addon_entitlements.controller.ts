import { OpenAPIHono } from "@hono/zod-openapi";
import type { AppEnv } from "@/container";
import {
  createAddonEntitlementRoute,
  listAddonEntitlementsRoute,
  getAddonEntitlementRoute,
  deleteAddonEntitlementRoute,
} from "./addon_entitlements.routes";

export const addonEntitlementsController = new OpenAPIHono<AppEnv>();

// POST /{addon_id}
addonEntitlementsController.openapi(
  createAddonEntitlementRoute,
  async (c) => {
    const { addon_id } = c.req.valid("param");
    const body = c.req.valid("json");
    const result = await c
      .get("addonEntitlements")
      .create.execute({ ...body, addon_id });
    return c.json(result, 201);
  },
);

// GET /
addonEntitlementsController.openapi(
  listAddonEntitlementsRoute,
  async (c) => {
    const query = c.req.valid("query");
    const result = await c.get("addonEntitlements").list.execute(query);
    return c.json(result, 200);
  },
);

// GET /{addon_id}/{entitlement_id}
addonEntitlementsController.openapi(
  getAddonEntitlementRoute,
  async (c) => {
    const { addon_id, entitlement_id } = c.req.valid("param");
    const result = await c
      .get("addonEntitlements")
      .get.execute({ addon_id, entitlement_id });
    return c.json(result, 200);
  },
);

// DELETE /{addon_id}/{entitlement_id}
addonEntitlementsController.openapi(
  deleteAddonEntitlementRoute,
  async (c) => {
    const { addon_id, entitlement_id } = c.req.valid("param");
    const result = await c
      .get("addonEntitlements")
      .delete.execute({ addon_id, entitlement_id });
    return c.json(result, 200);
  },
);
