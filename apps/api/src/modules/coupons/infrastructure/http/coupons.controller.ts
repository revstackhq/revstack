import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { createCouponSchema } from "@/modules/coupons/application/commands/CreateCouponCommand";
import { updateCouponSchema } from "@/modules/coupons/application/commands/UpdateCouponCommand";
import { listCouponsSchema } from "@/modules/coupons/application/queries/ListCouponsQuery";
import type { AppEnv } from "@/container";

export const couponsController = new OpenAPIHono<AppEnv>();

const createCouponRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["Coupons"],
  summary: "Create a coupon",
  description: "Creates a new discount coupon with percentage or fixed amount.",
  request: {
    body: { content: { "application/json": { schema: createCouponSchema } } },
  },
  responses: {
    201: {
      description: "Coupon created",
      content: { "application/json": { schema: z.any() } },
    },
    400: { description: "Validation error" },
  },
});
couponsController.openapi(createCouponRoute, async (c) => {
  const handler = c.get("coupons").create;
  const dto = c.req.valid("json");
  const result = await handler.handle(dto);
  return c.json(result, 201);
});

const updateCouponRoute = createRoute({
  method: "patch",
  path: "/{id}",
  tags: ["Coupons"],
  summary: "Update a coupon",
  description: "Updates the active status or metadata of a coupon.",
  request: {
    params: z.object({ id: z.string().openapi({ example: "coup_abc123" }) }),
    body: { content: { "application/json": { schema: updateCouponSchema } } },
  },
  responses: {
    200: {
      description: "Coupon updated",
      content: { "application/json": { schema: z.any() } },
    },
  },
});
couponsController.openapi(updateCouponRoute, async (c) => {
  const handler = c.get("coupons").update;
  const { id } = c.req.valid("param");
  const dto = c.req.valid("json");
  const result = await handler.handle({ couponId: id, ...dto });
  return c.json(result, 200);
});

const archiveCouponRoute = createRoute({
  method: "patch",
  path: "/{id}/archive",
  tags: ["Coupons"],
  summary: "Archive a coupon",
  description: "Archives a coupon, automatically deactivating it.",
  request: {
    params: z.object({ id: z.string().openapi({ example: "coup_abc123" }) }),
  },
  responses: {
    200: {
      description: "Coupon archived",
      content: { "application/json": { schema: z.any() } },
    },
  },
});
couponsController.openapi(archiveCouponRoute, async (c) => {
  const handler = c.get("coupons").archive;
  const { id } = c.req.valid("param");
  const result = await handler.handle({ id });
  return c.json(result, 200);
});

const deleteCouponRoute = createRoute({
  method: "delete",
  path: "/{id}",
  tags: ["Coupons"],
  summary: "Delete a coupon",
  description: "Permanently deletes a coupon.",
  request: {
    params: z.object({ id: z.string().openapi({ example: "coup_abc123" }) }),
  },
  responses: {
    200: {
      description: "Coupon deleted",
      content: { "application/json": { schema: z.any() } },
    },
  },
});

couponsController.openapi(deleteCouponRoute, async (c) => {
  const handler = c.get("coupons").delete;
  const { id } = c.req.valid("param");
  const result = await handler.handle({ id });
  return c.json(result, 200);
});

const listCouponsRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Coupons"],
  summary: "List coupons",
  description:
    "Retrieves coupons with optional environment and status filters.",
  request: { query: listCouponsSchema },
  responses: {
    200: {
      description: "List of coupons",
      content: { "application/json": { schema: z.array(z.any()) } },
    },
  },
});
couponsController.openapi(listCouponsRoute, async (c) => {
  const handler = c.get("coupons").list;
  const query = c.req.valid("query");
  const result = await handler.handle(query);
  return c.json(result, 200);
});

const getCouponRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["Coupons"],
  summary: "Get a coupon",
  description: "Retrieves a single coupon by ID.",
  request: {
    params: z.object({ id: z.string().openapi({ example: "coup_abc123" }) }),
  },
  responses: {
    200: {
      description: "Coupon details",
      content: { "application/json": { schema: z.any() } },
    },
  },
});
couponsController.openapi(getCouponRoute, async (c) => {
  const handler = c.get("coupons").get;
  const { id } = c.req.valid("param");
  const result = await handler.handle({ id });
  return c.json(result, 200);
});
