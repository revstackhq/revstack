import type { ICustomerRepository } from "@/modules/customers/application/ports/ICustomerRepository";
import type { ICacheService } from "@/modules/customers/application/ports/ICacheService";
import type { ListCustomersQuery } from "@/modules/customers/application/queries/ListCustomersQuery";

export class ListCustomersHandler {
  constructor(
    private readonly repository: ICustomerRepository,
    private readonly cache: ICacheService
  ) {}

  public async handle(query: ListCustomersQuery): Promise<any[]> {
    const cacheKey = "customers_list";
    const cached = await this.cache.get<any[]>(cacheKey);
    
    if (cached) {
      return cached;
    }

    const items = await this.repository.findAll();
    await this.cache.set(cacheKey, items, 60);

    return items;
  }
}
