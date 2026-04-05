import { z } from "zod";
import type { EntitlementRepository } from "@revstackhq/core";
import type { CacheService } from "@/common/application/ports/CacheService";

export const ListEntitlementsQuerySchema = z.object({
  environment_id: z.string(),
  limit: z.number().optional(),
  offset: z.number().optional(),
});

export type ListEntitlementsQuery = z.infer<typeof ListEntitlementsQuerySchema>;

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
