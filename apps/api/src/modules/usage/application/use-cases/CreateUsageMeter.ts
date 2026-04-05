import { z } from "zod";
import type { UsageRepository } from "@revstackhq/core";
import type { EventBus } from "@/common/application/ports/EventBus";
import { UsageMeterEntity } from "@revstackhq/core";
import { DomainError } from "@revstackhq/core";

export const createUsageMeterSchema = z.object({
  customerId: z.string().min(1),
  featureId: z.string().min(1),
  periodStart: z.string().datetime(),
  periodEnd: z.string().datetime(),
});

export type CreateUsageMeterCommand = z.infer<typeof createUsageMeterSchema>;

export class CreateUsageMeterHandler {
  constructor(
    private readonly repository: UsageRepository,
    private readonly eventBus: EventBus
  ) {}

  public async execute(command: CreateUsageMeterCommand) {
    const existing = await this.repository.findByCustomerAndFeature(command.customerId, command.featureId);
    if (existing) {
        throw new DomainError("Usage meter already exists for this customer and feature", 409, "ALREADY_EXISTS");
    }

    const meter = UsageMeterEntity.create(
      command.customerId,
      command.featureId,
      new Date(command.periodStart),
      new Date(command.periodEnd)
    );

    await this.repository.save(meter);
    await this.eventBus.publish({ eventName: "usage_meter.created", id: meter.id, customerId: meter.customerId });

    return {
      id: meter.id,
      customerId: meter.customerId,
      featureId: meter.featureId,
      currentUsage: meter.currentUsage,
      periodStart: meter.periodStart,
      periodEnd: meter.periodEnd
    };
  }
}
