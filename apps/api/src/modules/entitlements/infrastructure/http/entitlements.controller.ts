import { OpenAPIHono } from "@hono/zod-openapi";
import type { AppEnv } from "@/container";
import {
  createEntitlementRoute,
  updateEntitlementRoute,
  archiveEntitlementRoute,
  getEntitlementRoute,
  listEntitlementsRoute,
} from "./entitlements.routes";

export const entitlementsController = new OpenAPIHono<AppEnv>();

entitlementsController.openapi(createEntitlementRoute, async (c) => {
  const handler = c.get("entitlements").create;
  const body = c.req.valid("json");
  const environmentId = c.get("environmentId");

  const result = await handler.execute({
    ...body,
    environment_id: environmentId,
  });

  return c.json(result, 201);
});

entitlementsController.openapi(updateEntitlementRoute, async (c) => {
  const handler = c.get("entitlements").update;
  const body = c.req.valid("json");
  const { id } = c.req.valid("param");
  const environmentId = c.get("environmentId");

  const result = await handler.execute({
    ...body,
    id,
    environment_id: environmentId,
  });

  return c.json(result, 200);
});

entitlementsController.openapi(archiveEntitlementRoute, async (c) => {
  const handler = c.get("entitlements").archive;
  const { id } = c.req.valid("param");
  const environmentId = c.get("environmentId");

  const result = await handler.execute({
    id,
    environment_id: environmentId,
  });

  return c.json(result, 200);
});

entitlementsController.openapi(getEntitlementRoute, async (c) => {
  const handler = c.get("entitlements").get;
  const { id } = c.req.valid("param");
  const environmentId = c.get("environmentId");

  const result = await handler.execute({
    id,
    environment_id: environmentId,
  });

  return c.json(result, 200);
});

entitlementsController.openapi(listEntitlementsRoute, async (c) => {
  const handler = c.get("entitlements").list;
  const environmentId = c.get("environmentId");

  const result = await handler.execute({
    environment_id: environmentId,
  });

  return c.json(result, 200);
});
