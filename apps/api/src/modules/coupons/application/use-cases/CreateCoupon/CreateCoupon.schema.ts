import { z } from "zod";

export const CreateCouponCommandSchema = z.object({
  environment_id: z.string().min(1),
  code: z.string().min(1),
  type: z.enum(["percent", "fixed"]),
  amount: z.number().min(0),
  metadata: z.record(z.any()).optional(),
});

export type CreateCouponCommand = z.infer<typeof CreateCouponCommandSchema>;

export const CreateCouponResponseSchema = z.object({
  id: z.string(),
  environment_id: z.string(),
  code: z.string(),
  type: z.string(),
  amount: z.number(),
  is_active: z.boolean(),
  is_archived: z.boolean(),
  metadata: z.record(z.any()).optional(),
  created_at: z.date(),
  updated_at: z.date(),
});

export type CreateCouponResponse = z.infer<typeof CreateCouponResponseSchema>;
