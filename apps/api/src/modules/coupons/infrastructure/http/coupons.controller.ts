import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createCouponSchema } from "@/modules/coupons/application/commands/CreateCouponCommand";
import { updateCouponSchema } from "@/modules/coupons/application/commands/UpdateCouponCommand";
import { listCouponsSchema } from "@/modules/coupons/application/queries/ListCouponsQuery";
import type { AppEnv } from "@/container";

export const couponsController = new Hono<AppEnv>();

couponsController.post(
  "/",
  zValidator("json", createCouponSchema),
  async (c) => {
    const handler = c.get("coupons").create;
    const dto = c.req.valid("json");
    const result = await handler.handle(dto);
    return c.json(result, 201);
  }
);

couponsController.patch(
  "/:id",
  zValidator("json", updateCouponSchema),
  async (c) => {
    const handler = c.get("coupons").update;
    const dto = c.req.valid("json");
    const result = await handler.handle({ couponId: c.req.param("id"), ...dto });
    return c.json(result, 200);
  }
);

couponsController.patch("/:id/archive", async (c) => {
  const handler = c.get("coupons").archive;
  const result = await handler.handle({ id: c.req.param("id") });
  return c.json(result, 200);
});

couponsController.delete("/:id", async (c) => {
  const handler = c.get("coupons").delete;
  const result = await handler.handle({ id: c.req.param("id") });
  return c.json(result, 200);
});

couponsController.get(
  "/",
  zValidator("query", listCouponsSchema),
  async (c) => {
    const handler = c.get("coupons").list;
    const query = c.req.valid("query");
    const result = await handler.handle(query);
    return c.json(result, 200);
  }
);

couponsController.get("/:id", async (c) => {
  const handler = c.get("coupons").get;
  const result = await handler.handle({ id: c.req.param("id") });
  return c.json(result, 200);
});
