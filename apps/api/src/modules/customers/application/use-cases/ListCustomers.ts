import { z } from "zod";
import type { CustomerRepository } from "@revstackhq/core";
import type { CacheService } from "@/common/application/ports/CacheService";

export const ListCustomersQuerySchema = z.object({
  environment_id: z.string().min(1, "Environment is required"),
  limit: z.number().optional().default(10),
  offset: z.number().optional().default(0),
});

export type ListCustomersQuery = z.infer<typeof ListCustomersQuerySchema>;

export const CustomerResponseSchema = z.object({
  id: z.string(),
  environment_id: z.string(),
  user_id: z.string(),
  email: z.string().email(),
  name: z.string(),
  external_id: z.string(),
  phone: z.string().nullable(),
  metadata: z.record(z.any()).nullable(),
  created_at: z.date(),
});

export const ListCustomersResponseSchema = z.array(CustomerResponseSchema);

export type ListCustomersResponse = z.infer<typeof ListCustomersResponseSchema>;

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
