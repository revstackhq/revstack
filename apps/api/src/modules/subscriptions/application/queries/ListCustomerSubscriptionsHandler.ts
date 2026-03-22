import type { ISubscriptionRepository } from "@/modules/subscriptions/application/ports/ISubscriptionRepository";
import type { ICacheService } from "@/modules/subscriptions/application/ports/ICacheService";
import type { ListCustomerSubscriptionsQuery } from "@/modules/subscriptions/application/queries/ListCustomerSubscriptionsQuery";

export class ListCustomerSubscriptionsHandler {
  constructor(
    private readonly repository: ISubscriptionRepository,
    private readonly cache: ICacheService
  ) {}

  public async handle(query: ListCustomerSubscriptionsQuery): Promise<any[]> {
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
