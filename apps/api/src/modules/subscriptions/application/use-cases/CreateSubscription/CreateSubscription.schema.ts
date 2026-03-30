import { z } from "zod";

export const createSubscriptionSchema = z.object({
  customerId: z.string().min(1, "Customer ID is required"),
  planId: z.string().min(1, "Plan ID is required"),
  priceId: z.string().min(1, "Price ID is required"),
  couponId: z.string().optional(),
});

export type CreateSubscriptionCommand = z.infer<typeof createSubscriptionSchema>;
