import type { SubscriptionRepository } from "@revstackhq/core";
import { NotFoundError } from "@revstackhq/core";

export interface GetSubscriptionQuery {
  id: string;
}

export class GetSubscriptionHandler {
  constructor(private readonly repository: SubscriptionRepository) {}

  public async execute(query: GetSubscriptionQuery) {
    const subscription = await this.repository.findById(query.id);
    if (!subscription) {
      throw new NotFoundError("Subscription not found", "SUBSCRIPTION_NOT_FOUND");
    }
    return subscription;
  }
}
