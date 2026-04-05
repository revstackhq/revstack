import type { InvoiceRepository } from "@revstackhq/core";
import type { CacheService } from "@/common/application/ports/CacheService";

export interface ListInvoicesQuery {
  customerId?: string;
  limit?: number;
  offset?: number;
}

export class ListInvoicesHandler {
  constructor(
    private readonly repository: InvoiceRepository,
    private readonly cache: CacheService
  ) {}

  public async execute(query: ListInvoicesQuery): Promise<any[]> {
    const cacheKey = query.customerId ? `invoices_list_${query.customerId}` : "invoices_list_all";
    const cached = await this.cache.get<any[]>(cacheKey);
    
    if (cached) {
      return cached;
    }

    const items = await this.repository.findAll(); // Simplified for scaffolding
    await this.cache.set(cacheKey, items, 60);

    return items;
  }
}
