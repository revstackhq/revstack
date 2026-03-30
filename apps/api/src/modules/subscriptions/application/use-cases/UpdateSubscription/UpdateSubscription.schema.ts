import { z } from "zod";

export const updateSubscriptionSchema = z.object({
  planId: z.string().optional(),
  priceId: z.string().optional(),
  couponId: z.string().nullable().optional(),
  isAutoRenew: z.boolean().optional(),
});

export type UpdateSubscriptionCommand = {
  id: string;
} & z.infer<typeof updateSubscriptionSchema>;
