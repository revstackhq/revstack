import { z } from "zod";
import type { PriceRepository } from "@revstackhq/core";
import type { EventBus } from "@/common/application/ports/EventBus";
import { PriceNotFoundError } from "@revstackhq/core";

export const updatePriceSchema = z.object({
  name: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export type UpdatePriceCommand = {
  priceId: string;
} & z.infer<typeof updatePriceSchema>;

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
