import { OpenAPIHono } from "@hono/zod-openapi";
import type { AppEnv } from "@/container";
import {
  createPriceRoute,
  updatePriceRoute,
  versionPriceRoute,
  listPricesRoute,
  getPriceRoute,
} from "@/modules/prices/infrastructure/http/prices.routes";

export const pricesController = new OpenAPIHono<AppEnv>();


pricesController.openapi(createPriceRoute, async (c) => {
  const handler = c.get("prices").create;
  const dto = c.req.valid("json");
  const result = await handler.execute(dto);
  return c.json(result, 201);
});

pricesController.openapi(updatePriceRoute, async (c) => {
  const handler = c.get("prices").update;
  const { id } = c.req.valid("param");
  const dto = c.req.valid("json");
  const result = await handler.execute({ priceId: id, ...dto });
  return c.json(result, 200);
});

pricesController.openapi(versionPriceRoute, async (c) => {
  const handler = c.get("prices").version;
  const { id } = c.req.valid("param");
  const dto = c.req.valid("json");
  const result = await handler.execute({ priceId: id, ...dto });
  return c.json(result, 201);
});

pricesController.openapi(listPricesRoute, async (c) => {
  const handler = c.get("prices").list;
  const query = c.req.valid("query");
  const result = await handler.execute(query);
  return c.json(result, 200);
});

pricesController.openapi(getPriceRoute, async (c) => {
  const handler = c.get("prices").get;
  const { id } = c.req.valid("param");
  const result = await handler.execute({ id });
  return c.json(result, 200);
});
