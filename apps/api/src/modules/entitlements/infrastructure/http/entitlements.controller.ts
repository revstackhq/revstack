import { OpenAPIHono } from "@hono/zod-openapi";
import type { AppEnv } from "@/container";
import {
  listEntitlementsRoute,
  createEntitlementRoute,
  deleteEntitlementRoute,
} from "@/modules/entitlements/infrastructure/http/entitlements.routes";

export const entitlementsController = new OpenAPIHono<AppEnv>();

entitlementsController.openapi(listEntitlementsRoute, async (c) => {
  const handler = c.get("entitlements").list;
  const query = c.req.valid("query");
  const result = await handler.execute(query);
  return c.json(result, 200);
});

entitlementsController.openapi(createEntitlementRoute, async (c) => {
  const handler = c.get("entitlements").create;
  const dto = c.req.valid("json");
  const result = await handler.execute(dto);
  return c.json(result, 201);
});

entitlementsController.openapi(deleteEntitlementRoute, async (c) => {
  const handler = c.get("entitlements").delete;
  const { id } = c.req.valid("param");
  const result = await handler.execute({ id });
  return c.json(result, 200);
});
