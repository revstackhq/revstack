import { z } from "zod";

export const listSubscriptionsSchema = z.object({
  customerId: z.string().optional(),
  planId: z.string().optional(),
  status: z.enum(["active", "canceled", "past_due", "paused"]).optional(),
});

export type ListSubscriptionsQuery = z.infer<typeof listSubscriptionsSchema>;
