import { z } from "zod";

export const DeleteCouponCommandSchema = z.object({
  id: z.string().min(1),
});

export type DeleteCouponCommand = z.infer<typeof DeleteCouponCommandSchema>;
