import type { EntitlementRepository } from "@/modules/entitlements/application/ports/EntitlementRepository";
import type { CacheService } from "@/common/application/ports/CacheService";
import type { ListEntitlementsQuery } from "./ListEntitlements.schema";

export class ListEntitlementsHandler {
  constructor(
    private readonly repository: EntitlementRepository,
    private readonly cache: CacheService,
  ) {}

  public async execute(query: ListEntitlementsQuery): Promise<any[]> {
    const cacheKey = `env:${query.environment_id}:entitlements_list`;
    const cached = await this.cache.get<any[]>(cacheKey);

    if (cached) {
      return cached;
    }

    const items = await this.repository.findAll();
    await this.cache.set(cacheKey, items, 60);

    return items;
  }
}
