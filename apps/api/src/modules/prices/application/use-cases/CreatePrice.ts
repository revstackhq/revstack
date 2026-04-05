import { z } from "zod";
import type { PriceRepository } from "@revstackhq/core";
import type { EventBus } from "@/common/application/ports/EventBus";
import { PriceEntity } from "@revstackhq/core";

export const createPriceSchema = z.object({
  environmentId: z.string().min(1),
  name: z.string().min(1),
  amount: z.number().int().min(0),
  currency: z.string().length(3).toLowerCase(),
  interval: z.enum(["month", "year", "week", "day"]).optional(),
  type: z.enum(["recurring", "one_time"]),
  planId: z.string().optional(),
  addonId: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export type CreatePriceCommand = z.infer<typeof createPriceSchema>;

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
