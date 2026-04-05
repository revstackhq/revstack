import { OpenAPIHono } from "@hono/zod-openapi";
import type { AppEnv } from "@/container";
import {
  installIntegrationRoute,
  listIntegrationsRoute,
  getIntegrationRoute,
  updateIntegrationConfigRoute,
} from "@/modules/integrations/infrastructure/http/integrations.routes";

export const integrationsController = new OpenAPIHono<AppEnv>();


integrationsController.openapi(installIntegrationRoute, async (c) => {
  const handler = c.get("integrations").install;
  const dto = c.req.valid("json");
  const result = await handler.execute(dto);
  return c.json(result, 201);
});

integrationsController.openapi(listIntegrationsRoute, async (c) => {
  const handler = c.get("integrations").list;
  const query = c.req.valid("query");
  const result = await handler.execute(query);
  return c.json(result, 200);
});

integrationsController.openapi(getIntegrationRoute, async (c) => {
  const handler = c.get("integrations").get;
  const { id } = c.req.valid("param");
  const result = await handler.execute({ id });
  return c.json(result, 200);
});

integrationsController.openapi(updateIntegrationConfigRoute, async (c) => {
  const handler = c.get("integrations").updateConfig;
  const { id } = c.req.valid("param");
  const dto = c.req.valid("json");
  const result = await handler.execute({ id, ...dto });
  return c.json(result, 200);
});
