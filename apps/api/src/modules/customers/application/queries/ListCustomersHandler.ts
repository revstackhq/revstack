import type { CustomerRepository } from "@/modules/customers/application/ports/CustomerRepository";
import type { CacheService } from "@/common/application/ports/CacheService";
import type { ListCustomersQuery } from "@/modules/customers/application/queries/ListCustomersQuery";

export class ListCustomersHandler {
  constructor(
    private readonly repository: CustomerRepository,
    private readonly cache: CacheService,
  ) {}

  public async handle(query: ListCustomersQuery) {
    const cacheKey = `env:${query.environmentId}:customers:${query.limit}:${query.offset}`;

    const cached = await this.cache.get(cacheKey);

    if (cached) {
      return cached;
    }

    const entities = await this.repository.findByEnvironment(
      query.environmentId,
      { limit: query.limit, offset: query.offset },
    );

    const customersDto = entities.map((entity) => entity.val);

    await this.cache.set(cacheKey, customersDto, 60);

    return customersDto;
  }
}
