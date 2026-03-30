import type { CustomerRepository } from "@/modules/customers/application/ports/CustomerRepository";
import type { CacheService } from "@/common/application/ports/CacheService";
import type {
  ListCustomersQuery,
  ListCustomersResponse,
} from "./ListCustomers.schema";

export class ListCustomersHandler {
  constructor(
    private readonly repository: CustomerRepository,
    private readonly cache: CacheService,
  ) {}

  public async execute(
    query: ListCustomersQuery,
  ): Promise<ListCustomersResponse> {
    const cacheKey = `env:${query.environment_id}:customers:${query.limit}:${query.offset}`;

    const cached = await this.cache.get<ListCustomersResponse>(cacheKey);

    if (cached) {
      return cached;
    }

    const entities = await this.repository.findByEnvironment(
      query.environment_id,
      { limit: query.limit, offset: query.offset },
    );

    const customersDto = entities.map((entity) => {
      const v = entity.val;
      return {
        id: v.id!,
        environment_id: v.environmentId,
        user_id: v.userId,
        email: v.email,
        name: v.name,
        external_id: v.externalId,
        phone: v.phone ?? null,
        metadata: v.metadata ?? null,
        created_at: v.createdAt,
      };
    }) as ListCustomersResponse;

    await this.cache.set(cacheKey, customersDto, 60);

    return customersDto;
  }
}
