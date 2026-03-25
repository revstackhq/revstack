import type { SubscriptionRepository } from "@/modules/subscriptions/application/ports/SubscriptionRepository";
import type { GetSubscriptionQuery } from "@/modules/subscriptions/application/queries/GetSubscriptionQuery";
import { NotFoundError } from "@/common/errors/DomainError";

export class GetSubscriptionHandler {
  constructor(private readonly repository: SubscriptionRepository) {}

  public async handle(query: GetSubscriptionQuery) {
    const subscription = await this.repository.findById(query.id);
    if (!subscription) {
      throw new NotFoundError("Subscription not found", "SUBSCRIPTION_NOT_FOUND");
    }
    return subscription;
  }
}
