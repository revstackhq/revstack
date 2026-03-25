import type { PriceRepository } from "@/modules/prices/application/ports/PriceRepository";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { VersionPriceCommand } from "@/modules/prices/application/commands/VersionPriceCommand";
import { PriceNotFoundError } from "@/modules/prices/domain/PriceErrors";

export class VersionPriceHandler {
  constructor(
    private readonly repository: PriceRepository,
    private readonly eventBus: EventBus
  ) {}

  public async handle(command: VersionPriceCommand) {
    const oldPrice = await this.repository.findById(command.priceId);
    if (!oldPrice) {
      throw new PriceNotFoundError();
    }

    const newPrice = oldPrice.createNewVersion(command.amount, command.currency);

    // Save both the newly archived old price and the new versioned price
    await this.repository.save(oldPrice);
    await this.repository.save(newPrice);

    await this.eventBus.publish({ eventName: "price.versioned", oldId: oldPrice.id, newId: newPrice.id, environmentId: newPrice.environmentId });

    return newPrice.toPrimitives();
  }
}
