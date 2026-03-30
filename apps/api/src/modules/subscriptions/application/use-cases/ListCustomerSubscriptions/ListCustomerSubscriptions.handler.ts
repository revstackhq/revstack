import type { SubscriptionRepository } from "@/modules/subscriptions/application/ports/SubscriptionRepository";
import type { CacheService } from "@/common/application/ports/CacheService";
import type { ListCustomerSubscriptionsQuery } from "./ListCustomerSubscriptions.schema";

export class ListCustomerSubscriptionsHandler {
  constructor(
    private readonly repository: SubscriptionRepository,
    private readonly cache: CacheService
  ) {}

  public async execute(query: ListCustomerSubscriptionsQuery): Promise<any[]> {
    const cacheKey = `subs_customer_${query.customerId}`;
    const cached = await this.cache.get<any[]>(cacheKey);
    
    if (cached) {
      return cached;
    }

    const items = await this.repository.findByCustomerId(query.customerId);
    await this.cache.set(cacheKey, items, 60);

    return items;
  }
}
