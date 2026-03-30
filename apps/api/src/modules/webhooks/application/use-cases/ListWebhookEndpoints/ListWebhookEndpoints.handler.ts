import type { WebhookEndpointRepository } from "@/modules/webhooks/application/ports/WebhookEndpointRepository";
import type { CacheService } from "@/common/application/ports/CacheService";
import type { ListWebhookEndpointsQuery } from "./ListWebhookEndpoints.schema";

export class ListWebhookEndpointsHandler {
  constructor(
    private readonly repository: WebhookEndpointRepository,
    private readonly cache: CacheService
  ) {}

  public async execute(query: ListWebhookEndpointsQuery): Promise<any[]> {
    const cacheKey = "webhooks_endpoints_list";
    const cached = await this.cache.get<any[]>(cacheKey);
    
    if (cached) {
      return cached;
    }

    const items = await this.repository.findAll();
    await this.cache.set(cacheKey, items, 120); // 2 minutes TTL

    return items;
  }
}
