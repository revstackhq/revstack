import { z } from "zod";

export const GetCouponQuerySchema = z.object({
  id: z.string().min(1),
});

export type GetCouponQuery = z.infer<typeof GetCouponQuerySchema>;
