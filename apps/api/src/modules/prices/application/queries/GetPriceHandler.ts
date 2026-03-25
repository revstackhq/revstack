import type { PriceRepository } from "@/modules/prices/application/ports/PriceRepository";
import type { GetPriceQuery } from "@/modules/prices/application/queries/GetPriceQuery";
import { PriceNotFoundError } from "@/modules/prices/domain/PriceErrors";

export class GetPriceHandler {
  constructor(private readonly repository: PriceRepository) {}

  public async handle(query: GetPriceQuery) {
    const price = await this.repository.findById(query.id);
    if (!price) {
      throw new PriceNotFoundError();
    }
    return price.toPrimitives();
  }
}
