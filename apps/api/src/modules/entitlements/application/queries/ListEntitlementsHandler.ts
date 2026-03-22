import type { IEntitlementRepository } from "@/modules/entitlements/application/ports/IEntitlementRepository";
import type { ICacheService } from "@/modules/entitlements/application/ports/ICacheService";
import type { ListEntitlementsQuery } from "@/modules/entitlements/application/queries/ListEntitlementsQuery";

export class ListEntitlementsHandler {
  constructor(
    private readonly repository: IEntitlementRepository,
    private readonly cache: ICacheService
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
