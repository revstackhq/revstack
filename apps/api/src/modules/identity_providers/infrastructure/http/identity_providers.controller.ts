import { OpenAPIHono } from "@hono/zod-openapi";
import type { AppEnv } from "@/container";
import {
  putAuthConfigRoute,
  listAuthConfigsRoute,
  getAuthConfigRoute,
} from "@/modules/identity_providers/infrastructure/http/identity_providers.routes";

export const authController = new OpenAPIHono<AppEnv>();

authController.openapi(putAuthConfigRoute, async (c) => {
  const handler = c.get("auth").putConfig;
  const dto = c.req.valid("json");
  const result = await handler.execute(dto);
  return c.json(result, 200);
});

authController.openapi(listAuthConfigsRoute, async (c) => {
  const handler = c.get("auth").listConfigs;
  const query = c.req.valid("query");
  const result = await handler.execute(query);
  return c.json(result, 200);
});

authController.openapi(getAuthConfigRoute, async (c) => {
  const handler = c.get("auth").getConfig;
  const { id } = c.req.valid("param");
  const result = await handler.execute({ id });
  return c.json(result, 200);
});
