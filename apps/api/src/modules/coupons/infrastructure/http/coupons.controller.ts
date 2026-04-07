import { OpenAPIHono } from "@hono/zod-openapi";
import type { AppEnv } from "@/container";
import {
  createCouponRoute,
  updateCouponRoute,
  archiveCouponRoute,
  getCouponRoute,
  listCouponsRoute,
  validateCouponRoute,
} from "./coupons.routes";

export const couponsController = new OpenAPIHono<AppEnv>();

couponsController.openapi(createCouponRoute, async (c) => {
  const handler = c.get("coupons").create;
  const body = c.req.valid("json");
  const environmentId = c.get("environmentId");

  const result = await handler.execute({
    ...body,
    environment_id: environmentId,
  });

  return c.json(result, 201);
});

couponsController.openapi(updateCouponRoute, async (c) => {
  const handler = c.get("coupons").update;
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

couponsController.openapi(archiveCouponRoute, async (c) => {
  const handler = c.get("coupons").archive;
  const { id } = c.req.valid("param");
  const environmentId = c.get("environmentId");

  const result = await handler.execute({
    id,
    environment_id: environmentId,
  });

  return c.json(result, 200);
});

couponsController.openapi(getCouponRoute, async (c) => {
  const handler = c.get("coupons").get;
  const { id } = c.req.valid("param");
  const environmentId = c.get("environmentId");

  const result = await handler.execute({
    id,
    environment_id: environmentId,
  });

  return c.json(result, 200);
});

couponsController.openapi(listCouponsRoute, async (c) => {
  const handler = c.get("coupons").list;
  const query = c.req.valid("query");
  const environmentId = c.get("environmentId");

  const result = await handler.execute({
    ...query,
    environment_id: environmentId,
  });

  return c.json(result, 200);
});

couponsController.openapi(validateCouponRoute, async (c) => {
  const handler = c.get("coupons").validate;
  const body = c.req.valid("json");
  const environmentId = c.get("environmentId");

  const result = await handler.execute({
    ...body,
    environment_id: environmentId,
  });

  return c.json(result, 200);
});
