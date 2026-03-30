import type { PriceRepository } from "@/modules/prices/application/ports/PriceRepository";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { UpdatePriceCommand } from "./UpdatePrice.schema";
import { PriceNotFoundError } from "@/modules/prices/domain/PriceErrors";

export class UpdatePriceHandler {
  constructor(
    private readonly repository: PriceRepository,
    private readonly eventBus: EventBus
  ) {}

  public async execute(command: UpdatePriceCommand) {
    const price = await this.repository.findById(command.priceId);
    if (!price) {
      throw new PriceNotFoundError();
    }

    price.update(command);

    await this.repository.save(price);
    await this.eventBus.publish({ eventName: "price.updated", id: price.id, environmentId: price.environmentId });

    return price.val;
  }
}
