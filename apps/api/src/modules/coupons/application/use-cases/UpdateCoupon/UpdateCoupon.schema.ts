import { z } from "zod";

export const UpdateCouponCommandSchema = z.object({
  is_active: z.boolean().optional(),
  metadata: z.record(z.any()).optional(),
});

export type UpdateCouponCommand = {
  coupon_id: string;
} & z.infer<typeof UpdateCouponCommandSchema>;

export const UpdateCouponResponseSchema = z.any();

export type UpdateCouponResponse = z.infer<typeof UpdateCouponResponseSchema>;
