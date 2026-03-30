import { OpenAPIHono } from "@hono/zod-openapi";
import type { AppEnv } from "@/container";
import {
  createCouponRoute,
  updateCouponRoute,
  archiveCouponRoute,
  deleteCouponRoute,
  listCouponsRoute,
  getCouponRoute,
} from "./coupons.routes";

export const couponsController = new OpenAPIHono<AppEnv>();

couponsController.openapi(createCouponRoute, async (c) => {
  const handler = c.get("coupons").create;
  const dto = c.req.valid("json");
  const result = await handler.execute(dto);
  return c.json(result, 201);
});

couponsController.openapi(updateCouponRoute, async (c) => {
  const handler = c.get("coupons").update;
  const { id } = c.req.valid("param");
  const dto = c.req.valid("json");
  const result = await handler.execute({ coupon_id: id, ...dto });
  return c.json(result, 200);
});

couponsController.openapi(archiveCouponRoute, async (c) => {
  const handler = c.get("coupons").archive;
  const { id } = c.req.valid("param");
  const result = await handler.execute({ id });
  return c.json(result, 200);
});

couponsController.openapi(deleteCouponRoute, async (c) => {
  const handler = c.get("coupons").delete;
  const { id } = c.req.valid("param");
  const result = await handler.execute({ id });
  return c.json(result, 200);
});

couponsController.openapi(listCouponsRoute, async (c) => {
  const handler = c.get("coupons").list;
  const query = c.req.valid("query");
  const result = await handler.execute(query);
  return c.json(result, 200);
});

couponsController.openapi(getCouponRoute, async (c) => {
  const handler = c.get("coupons").get;
  const { id } = c.req.valid("param");
  const result = await handler.execute({ id });
  return c.json(result, 200);
});
