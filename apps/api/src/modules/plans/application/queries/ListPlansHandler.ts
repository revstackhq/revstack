import type { PlanRepository } from "@/modules/plans/application/ports/PlanRepository";
import type { CacheService } from "@/common/application/ports/CacheService";
import type { ListPlansQuery } from "@/modules/plans/application/queries/ListPlansQuery";

export class ListPlansHandler {
  constructor(
    private readonly repository: PlanRepository,
    private readonly cache: CacheService
  ) {}

  public async handle(query: ListPlansQuery): Promise<any[]> {
    const cacheKey = "plans_list";
    const cached = await this.cache.get<any[]>(cacheKey);
    
    if (cached) {
      return cached;
    }

    const items = await this.repository.findAll();
    await this.cache.set(cacheKey, items, 60);

    return items;
  }
}
