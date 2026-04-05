import type { PlanRepository } from "@revstackhq/core";
import type { CacheService } from "@/common/application/ports/CacheService";

export interface ListPlansQuery {
  limit?: number;
  offset?: number;
}

export class ListPlansHandler {
  constructor(
    private readonly repository: PlanRepository,
    private readonly cache: CacheService
  ) {}

  public async execute(query: ListPlansQuery): Promise<any[]> {
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
