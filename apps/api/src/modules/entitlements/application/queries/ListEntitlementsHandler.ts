import type { EntitlementRepository } from "@/modules/entitlements/application/ports/EntitlementRepository";
import type { CacheService } from "@/common/application/ports/CacheService";
import type { ListEntitlementsQuery } from "@/modules/entitlements/application/queries/ListEntitlementsQuery";

export class ListEntitlementsHandler {
  constructor(
    private readonly repository: EntitlementRepository,
    private readonly cache: CacheService
  ) {}

  public async handle(query: ListEntitlementsQuery): Promise<any[]> {
    const cacheKey = "entitlements_list";
    const cached = await this.cache.get<any[]>(cacheKey);
    
    if (cached) {
      return cached;
    }

    const items = await this.repository.findAll();
    await this.cache.set(cacheKey, items, 60);

    return items;
  }
}
