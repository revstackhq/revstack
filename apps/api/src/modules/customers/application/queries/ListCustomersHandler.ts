import type { CustomerRepository } from "@/modules/customers/application/ports/CustomerRepository";
import type { CacheService } from "@/common/application/ports/CacheService";
import type { ListCustomersQuery } from "@/modules/customers/application/queries/ListCustomersQuery";
import { CustomerEntity } from "@/modules/customers/domain/CustomerEntity";

export class ListCustomersHandler {
  constructor(
    private readonly repository: CustomerRepository,
    private readonly cache: CacheService,
  ) {}

  public async handle(query: ListCustomersQuery): Promise<CustomerEntity[]> {
    const cacheKey = `env:${query.environmentId}:customers`;
    const cached = await this.cache.get<CustomerEntity[]>(cacheKey);

    if (cached) {
      return cached;
    }

    const items = await this.repository.findAll();
    await this.cache.set(cacheKey, items, 60);

    return items;
  }
}
