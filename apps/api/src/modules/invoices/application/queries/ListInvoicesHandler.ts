import type { InvoiceRepository } from "@/modules/invoices/application/ports/InvoiceRepository";
import type { CacheService } from "@/common/application/ports/CacheService";
import type { ListInvoicesQuery } from "@/modules/invoices/application/queries/ListInvoicesQuery";

export class ListInvoicesHandler {
  constructor(
    private readonly repository: InvoiceRepository,
    private readonly cache: CacheService
  ) {}

  public async handle(query: ListInvoicesQuery): Promise<any[]> {
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
