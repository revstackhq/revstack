import type { UsageRepository } from "@revstackhq/core";
import type { CacheService } from "@/common/application/ports/CacheService";
import { UsageMeterNotFoundError } from "@revstackhq/core";

export interface GetUsageMeterQuery {
  customerId: string;
  featureId: string;
}

export class GetUsageMeterHandler {
  constructor(
    private readonly repository: UsageRepository,
    private readonly cache: CacheService
  ) {}

  public async execute(query: GetUsageMeterQuery): Promise<any> {
    const cacheKey = `usage_${query.customerId}_${query.featureId}`;
    const cached = await this.cache.get<any>(cacheKey);
    
    if (cached) {
      return cached;
    }

    const meter = await this.repository.findByCustomerAndFeature(query.customerId, query.featureId);
    
    if (!meter) {
      throw new UsageMeterNotFoundError(query.customerId, query.featureId);
    }

    // Cache the meter object, since reads for meters are extremely high volume
    await this.cache.set(cacheKey, meter, 30); // 30 seconds TTL

    return meter;
  }
}
