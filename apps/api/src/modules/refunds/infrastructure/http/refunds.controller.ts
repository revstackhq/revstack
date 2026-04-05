import { OpenAPIHono } from "@hono/zod-openapi";
import type { AppEnv } from "@/container";
import {
  createRefundRoute,
  updateRefundRoute,
  listRefundsRoute,
  getRefundRoute,
} from "@/modules/refunds/infrastructure/http/refunds.routes";

export const refundsController = new OpenAPIHono<AppEnv>();


refundsController.openapi(createRefundRoute, async (c) => {
  const handler = c.get("refunds").create;
  const { paymentId } = c.req.valid("param");
  const dto = c.req.valid("json");
  const result = await handler.execute({ paymentId, ...dto });
  return c.json(result, 201);
});

refundsController.openapi(updateRefundRoute, async (c) => {
  const handler = c.get("refunds").update;
  const { id } = c.req.valid("param");
  const dto = c.req.valid("json");
  const result = await handler.execute({ id, ...dto });
  return c.json(result, 200);
});

refundsController.openapi(listRefundsRoute, async (c) => {
  const handler = c.get("refunds").list;
  const query = c.req.valid("query");
  const result = await handler.execute(query);
  return c.json(result, 200);
});

refundsController.openapi(getRefundRoute, async (c) => {
  const handler = c.get("refunds").get;
  const { id } = c.req.valid("param");
  const result = await handler.execute({ id });
  return c.json(result, 200);
});
