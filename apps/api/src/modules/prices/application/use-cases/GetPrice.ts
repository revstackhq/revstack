import type { PriceRepository } from "@revstackhq/core";
import { PriceNotFoundError } from "@revstackhq/core";

export interface GetPriceQuery {
  id: string;
}

export class GetPriceHandler {
  constructor(private readonly repository: PriceRepository) {}

  public async execute(query: GetPriceQuery) {
    const price = await this.repository.findById(query.id);
    if (!price) {
      throw new PriceNotFoundError();
    }
    return price.val;
  }
}
