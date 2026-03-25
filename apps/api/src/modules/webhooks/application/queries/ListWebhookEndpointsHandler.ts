import type { IWebhookEndpointRepository } from "@/modules/webhooks/application/ports/IWebhookEndpointRepository";
import type { ICacheService } from "@/common/application/ports/ICacheService";
import type { ListWebhookEndpointsQuery } from "@/modules/webhooks/application/queries/ListWebhookEndpointsQuery";

export class ListWebhookEndpointsHandler {
  constructor(
    private readonly repository: IWebhookEndpointRepository,
    private readonly cache: ICacheService
  ) {}

  public async handle(query: ListWebhookEndpointsQuery): Promise<any[]> {
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
