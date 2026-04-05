import { z } from "zod";
import type { PriceRepository } from "@revstackhq/core";
import type { EventBus } from "@/common/application/ports/EventBus";
import { PriceNotFoundError } from "@revstackhq/core";

export const versionPriceSchema = z.object({
  amount: z.number().int().min(0, "Amount must be positive"),
  currency: z.string().length(3).toLowerCase().optional(),
});

export type VersionPriceCommand = {
  priceId: string;
} & z.infer<typeof versionPriceSchema>;

export class VersionPriceHandler {
  constructor(
    private readonly repository: PriceRepository,
    private readonly eventBus: EventBus
  ) {}

  public async execute(command: VersionPriceCommand) {
    const oldPrice = await this.repository.findById(command.priceId);
    if (!oldPrice) {
      throw new PriceNotFoundError();
    }

    const newPrice = oldPrice.createNewVersion(command.amount, command.currency);

    // Save both the newly archived old price and the new versioned price
    await this.repository.save(oldPrice);
    await this.repository.save(newPrice);

    await this.eventBus.publish({ eventName: "price.versioned", oldId: oldPrice.id, newId: newPrice.id, environmentId: newPrice.environmentId });

    return newPrice.val;
  }
}
