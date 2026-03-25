import type { PriceRepository } from "@/modules/prices/application/ports/PriceRepository";
import type { ListPricesQuery } from "@/modules/prices/application/queries/ListPricesQuery";

export class ListPricesHandler {
  constructor(private readonly repository: PriceRepository) {}

  public async handle(query: ListPricesQuery) {
    const prices = await this.repository.find({
      environmentId: query.environmentId,
      planId: query.planId,
      addonId: query.addonId,
      isArchived: query.isArchived,
    });
    return prices.map(p => p.toPrimitives());
  }
}
