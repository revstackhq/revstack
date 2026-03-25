import { z } from "zod";

export const createCouponSchema = z.object({
  environmentId: z.string().min(1),
  code: z.string().min(1),
  type: z.enum(["percent", "fixed"]),
  amount: z.number().min(0),
  metadata: z.record(z.any()).optional(),
});

export type CreateCouponCommand = z.infer<typeof createCouponSchema>;
