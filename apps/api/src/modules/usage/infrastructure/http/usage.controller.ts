import { OpenAPIHono } from "@hono/zod-openapi";
import type { AppEnv } from "@/container";
import {
  recordUsageRoute,
  getUsageMeterRoute,
  listUsagesRoute,
  createUsageMeterRoute,
  updateUsageMeterRoute,
} from "@/modules/usage/infrastructure/http/usage.routes";

export const usageController = new OpenAPIHono<AppEnv>();


usageController.openapi(recordUsageRoute, async (c) => {
  const handler = c.get("usage").record;
  const dto = c.req.valid("json");
  const id = await handler.execute(dto);
  return c.json({ id, success: true }, 200);
});

usageController.openapi(getUsageMeterRoute, async (c) => {
  const handler = c.get("usage").getMeter;
  const { customerId, featureId } = c.req.valid("param");
  const result = await handler.execute({ customerId, featureId });
  return c.json(result, 200);
});

usageController.openapi(listUsagesRoute, async (c) => {
  const handler = c.get("usage").list;
  const query = c.req.valid("query");
  const result = await handler.execute(query);
  return c.json(result, 200);
});

usageController.openapi(createUsageMeterRoute, async (c) => {
  const handler = c.get("usage").createMeter;
  const dto = c.req.valid("json");
  const result = await handler.execute(dto);
  return c.json(result, 201);
});

usageController.openapi(updateUsageMeterRoute, async (c) => {
  const handler = c.get("usage").updateMeter;
  const { id } = c.req.valid("param");
  const dto = c.req.valid("json");
  const result = await handler.execute({ id, ...dto });
  return c.json(result, 200);
});
