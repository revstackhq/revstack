import type { SubscriptionRepository } from "@/modules/subscriptions/application/ports/SubscriptionRepository";
import type { ListSubscriptionsQuery } from "@/modules/subscriptions/application/queries/ListSubscriptionsQuery";

export class ListSubscriptionsHandler {
  constructor(private readonly repository: SubscriptionRepository) {}

  public async handle(query: ListSubscriptionsQuery) {
    const subscriptions = await this.repository.find({
      customerId: query.customerId,
      planId: query.planId,
      status: query.status,
    });
    return subscriptions;
  }
}
