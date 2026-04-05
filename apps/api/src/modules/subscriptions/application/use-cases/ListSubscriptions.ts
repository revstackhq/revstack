import { z } from "zod";
import type { SubscriptionRepository } from "@revstackhq/core";

export const listSubscriptionsSchema = z.object({
  customerId: z.string().optional(),
  planId: z.string().optional(),
  status: z.enum(["active", "canceled", "past_due", "paused"]).optional(),
});

export type ListSubscriptionsQuery = z.infer<typeof listSubscriptionsSchema>;

export class ListSubscriptionsHandler {
  constructor(private readonly repository: SubscriptionRepository) {}

  public async execute(query: ListSubscriptionsQuery) {
    const subscriptions = await this.repository.find({
      customerId: query.customerId,
      planId: query.planId,
      status: query.status,
    });
    return subscriptions;
  }
}
