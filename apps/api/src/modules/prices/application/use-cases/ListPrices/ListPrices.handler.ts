import type { PriceRepository } from "@/modules/prices/application/ports/PriceRepository";
import type { ListPricesQuery } from "./ListPrices.schema";

export class ListPricesHandler {
  constructor(private readonly repository: PriceRepository) {}

  public async execute(query: ListPricesQuery) {
    const prices = await this.repository.find({
      environmentId: query.environmentId,
      planId: query.planId,
      addonId: query.addonId,
      isArchived: query.isArchived,
    });
    return prices.map(p => p.val);
  }
}
