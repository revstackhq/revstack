import { OpenAPIHono } from "@hono/zod-openapi";
import type { AppEnv } from "@/container";
import {
  processPaymentRoute,
  listPaymentsRoute,
  getPaymentRoute,
} from "@/modules/payments/infrastructure/http/payments.routes";

export const paymentsController = new OpenAPIHono<AppEnv>();


paymentsController.openapi(processPaymentRoute, async (c) => {
  const handler = c.get("payments").process;
  const dto = c.req.valid("json");
  const result = await handler.execute(dto);
  return c.json(result, 201);
});

paymentsController.openapi(listPaymentsRoute, async (c) => {
  const handler = c.get("payments").list;
  const query = c.req.valid("query");
  const result = await handler.execute(query);
  return c.json(result, 200);
});

paymentsController.openapi(getPaymentRoute, async (c) => {
  const handler = c.get("payments").get;
  const { id } = c.req.valid("param");
  const result = await handler.execute({ id });
  return c.json(result, 200);
});
