import { z } from "zod";

export const updateCouponSchema = z.object({
  isActive: z.boolean().optional(),
  metadata: z.record(z.any()).optional(),
});

export type UpdateCouponCommand = {
  couponId: string;
} & z.infer<typeof updateCouponSchema>;
