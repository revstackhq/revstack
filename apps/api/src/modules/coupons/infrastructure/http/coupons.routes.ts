import { createRoute, z } from "@hono/zod-openapi";
import {
  CreateCouponCommandSchema,
  CreateCouponResponseSchema,
} from "@/modules/coupons/application/use-cases/CreateCoupon";
import {
  UpdateCouponCommandSchema,
  UpdateCouponResponseSchema,
} from "@/modules/coupons/application/use-cases/UpdateCoupon";
import { ArchiveCouponResponseSchema } from "@/modules/coupons/application/use-cases/ArchiveCoupon";
import { GetCouponResponseSchema } from "@/modules/coupons/application/use-cases/GetCoupon";
import {
  ListCouponsQuerySchema,
  ListCouponsResponseSchema,
} from "@/modules/coupons/application/use-cases/ListCoupons";
import {
  ValidateCouponCommandSchema,
  ValidateCouponResponseSchema,
} from "@/modules/coupons/application/use-cases/ValidateCoupon";

export const createCouponRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["Coupons"],
  summary: "Create a new coupon",
  description: "Creates a new coupon.",
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateCouponCommandSchema.omit({ environment_id: true }),
        },
      },
    },
  },
  responses: {
    201: {
      description: "Coupon created",
      content: { "application/json": { schema: CreateCouponResponseSchema } },
    },
  },
});

export const updateCouponRoute = createRoute({
  method: "patch",
  path: "/{id}",
  tags: ["Coupons"],
  summary: "Update a coupon",
  description: "Updates an existing coupon.",
  request: {
    params: z.object({ id: z.string().openapi({ example: "cou_abc123" }) }),
    body: {
      content: {
        "application/json": {
          schema: UpdateCouponCommandSchema.omit({
            environment_id: true,
            id: true,
          }),
        },
      },
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
  method: "post",
  path: "/{id}/archive",
  tags: ["Coupons"],
  summary: "Archive a coupon",
  description: "Archives a coupon.",
  request: {
    params: z.object({ id: z.string().openapi({ example: "cou_abc123" }) }),
  },
  responses: {
    200: {
      description: "Coupon archived",
      content: { "application/json": { schema: ArchiveCouponResponseSchema } },
    },
  },
});

export const getCouponRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["Coupons"],
  summary: "Get a coupon",
  description: "Retrieves a coupon by ID.",
  request: {
    params: z.object({ id: z.string().openapi({ example: "cou_abc123" }) }),
  },
  responses: {
    200: {
      description: "Coupon retrieved",
      content: { "application/json": { schema: GetCouponResponseSchema } },
    },
  },
});

export const listCouponsRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Coupons"],
  summary: "List coupons",
  description: "Retrieves a list of coupons.",
  request: {
    query: ListCouponsQuerySchema.omit({ environment_id: true }),
  },
  responses: {
    200: {
      description: "Coupons retrieved",
      content: { "application/json": { schema: ListCouponsResponseSchema } },
    },
  },
});

export const validateCouponRoute = createRoute({
  method: "post",
  path: "/validate",
  tags: ["Coupons"],
  summary: "Validate a coupon",
  description: "Validates a coupon for an upcoming or existing subscription.",
  request: {
    body: {
      content: {
        "application/json": {
          schema: ValidateCouponCommandSchema.omit({ environment_id: true }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Coupon validation result",
      content: { "application/json": { schema: ValidateCouponResponseSchema } },
    },
  },
});
