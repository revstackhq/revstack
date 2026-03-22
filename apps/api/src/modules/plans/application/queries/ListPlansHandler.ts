import type { IPlanRepository } from "@/modules/plans/application/ports/IPlanRepository";
import type { ICacheService } from "@/modules/plans/application/ports/ICacheService";
import type { ListPlansQuery } from "@/modules/plans/application/queries/ListPlansQuery";

export class ListPlansHandler {
  constructor(
    private readonly repository: IPlanRepository,
    private readonly cache: ICacheService
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
