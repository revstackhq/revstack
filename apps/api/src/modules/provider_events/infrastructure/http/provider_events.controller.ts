import { OpenAPIHono } from "@hono/zod-openapi";
import type { AppEnv } from "@/container";
import {
  createProviderEventRoute,
  listProviderEventsRoute,
  getProviderEventRoute,
} from "@/modules/provider_events/infrastructure/http/provider_events.routes";

export const providerEventsController = new OpenAPIHono<AppEnv>();


providerEventsController.openapi(createProviderEventRoute, async (c) => {
  const handler = c.get("providerEvents").create;
  const dto = c.req.valid("json");
  const result = await handler.execute(dto);
  return c.json(result, 201);
});

providerEventsController.openapi(listProviderEventsRoute, async (c) => {
  const handler = c.get("providerEvents").list;
  const query = c.req.valid("query");
  const result = await handler.execute(query);
  return c.json(result, 200);
});

providerEventsController.openapi(getProviderEventRoute, async (c) => {
  const handler = c.get("providerEvents").get;
  const { id } = c.req.valid("param");
  const result = await handler.execute({ id });
  return c.json(result, 200);
});
