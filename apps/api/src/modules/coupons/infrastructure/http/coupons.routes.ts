import { createRoute, z } from "@hono/zod-openapi";
import {
  CreateCouponCommandSchema,
  CreateCouponResponseSchema,
} from "@/modules/coupons/application/use-cases/CreateCoupon";
import {
  UpdateCouponCommandSchema,
  UpdateCouponResponseSchema,
} from "@/modules/coupons/application/use-cases/UpdateCoupon";
import {
  ListCouponsQuerySchema,
  ListCouponsResponse,
} from "@/modules/coupons/application/use-cases/ListCoupons";
import { GetCouponResponseSchema } from "@/modules/coupons/application/use-cases/GetCoupon";
import { DeleteCouponResponseSchema } from "@/modules/coupons/application/use-cases/DeleteCoupon";
import { ArchiveCouponResponseSchema } from "@/modules/coupons/application/use-cases/ArchiveCoupon";

export const createCouponRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["Coupons"],
  summary: "Create a coupon",
  description: "Creates a new discount coupon with percentage or fixed amount.",
  request: {
    body: {
      content: { "application/json": { schema: CreateCouponCommandSchema } },
    },
  },
  responses: {
    201: {
      description: "Coupon created",
      content: { "application/json": { schema: CreateCouponResponseSchema } },
    },
    400: { description: "Validation error" },
  },
});

export const updateCouponRoute = createRoute({
  method: "patch",
  path: "/{id}",
  tags: ["Coupons"],
  summary: "Update a coupon",
  description: "Updates the active status or metadata of a coupon.",
  request: {
    params: z.object({ id: z.string().openapi({ example: "coup_abc123" }) }),
    body: {
      content: { "application/json": { schema: UpdateCouponCommandSchema } },
    },
  },
  responses: {
    200: {
      description: "Coupon updated",
      content: { "application/json": { schema: UpdateCouponResponseSchema } },
    },
  },
});

export const archiveCouponRoute = createRoute({
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
      content: { "application/json": { schema: ArchiveCouponResponseSchema } },
    },
  },
});

export const deleteCouponRoute = createRoute({
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
      content: { "application/json": { schema: DeleteCouponResponseSchema } },
    },
  },
});

export const listCouponsRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Coupons"],
  summary: "List coupons",
  description:
    "Retrieves coupons with optional environment and status filters.",
  request: { query: ListCouponsQuerySchema },
  responses: {
    200: {
      description: "List of coupons",
      content: { "application/json": { schema: ListCouponsResponse } },
    },
  },
});

export const getCouponRoute = createRoute({
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
      content: { "application/json": { schema: GetCouponResponseSchema } },
    },
  },
});
