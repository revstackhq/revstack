import type { PriceRepository } from "@/modules/prices/application/ports/PriceRepository";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { CreatePriceCommand } from "./CreatePrice.schema";
import { PriceEntity } from "@/modules/prices/domain/PriceEntity";

export class CreatePriceHandler {
  constructor(
    private readonly repository: PriceRepository,
    private readonly eventBus: EventBus
  ) {}

  public async execute(command: CreatePriceCommand) {
    const price = PriceEntity.create(command);

    await this.repository.save(price);
    await this.eventBus.publish({ eventName: "price.created", id: price.id, environmentId: price.environmentId });

    return price.val;
  }
}
