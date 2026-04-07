import { z } from "zod";
import type { CacheService } from "@/common/application/ports/CacheService";
import type { EntitlementRepository } from "@revstackhq/core";

export const ListEntitlementsQuerySchema = z.object({
  environment_id: z.string().min(1),
});

export type ListEntitlementsQuery = z.infer<typeof ListEntitlementsQuerySchema>;

export const EntitlementItemSchema = z.object({
  id: z.string(),
  environment_id: z.string(),
  slug: z.string(),
  name: z.string(),
  description: z.string().optional(),
  type: z.string(),
  unit_type: z.string(),
  status: z.string(),
  metadata: z.record(z.unknown()),
  created_at: z.date(),
  updated_at: z.date(),
});

export const ListEntitlementsResponseSchema = z.array(EntitlementItemSchema);

export type ListEntitlementsResponse = z.infer<
  typeof ListEntitlementsResponseSchema
>;

export class ListEntitlementsHandler {
  constructor(
    private readonly repository: EntitlementRepository,
    private readonly cache?: CacheService,
  ) {}

  public async execute(
    query: ListEntitlementsQuery,
  ): Promise<ListEntitlementsResponse> {
    const cacheKey = `entitlements:list:${query.environment_id}`;

    if (this.cache) {
      const cached = await this.cache.get<ListEntitlementsResponse>(cacheKey);
      if (cached) {
        return cached;
      }
    }

    const items = await this.repository.findMany({
      environmentId: query.environment_id,
    });

    const response = items.map((item) => {
      const v = item.val;

      return {
        id: v.id,
        environment_id: v.environmentId,
        slug: v.slug,
        name: v.name,
        description: v.description,
        type: v.type,
        unit_type: v.unitType,
        status: v.status,
        metadata: v.metadata ?? {},
        created_at: v.createdAt,
        updated_at: v.updatedAt,
      };
    });

    if (this.cache) {
      await this.cache.set(cacheKey, response, 60);
    }

    return response;
  }
}
