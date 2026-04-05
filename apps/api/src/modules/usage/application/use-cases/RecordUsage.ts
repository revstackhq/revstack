import { z } from "zod";
import type { UsageRepository } from "@revstackhq/core";
import type { EventBus } from "@/common/application/ports/EventBus";
import { UsageRecordedEvent } from "@revstackhq/core";
import { UsageMeterEntity } from "@revstackhq/core";

export const recordUsageSchema = z.object({
  customerId: z.string().min(1, "Customer ID is required"),
  featureId: z.string().min(1, "Feature ID is required"),
  amount: z.number().positive("Amount must be positive"),
});

export type RecordUsageCommand = z.infer<typeof recordUsageSchema>;

export class RecordUsageHandler {
  constructor(
    private readonly repository: UsageRepository,
    private readonly eventBus: EventBus
  ) {}

  public async execute(command: RecordUsageCommand): Promise<string> {
    let meter = await this.repository.findByCustomerAndFeature(command.customerId, command.featureId);
    
    // Auto-create meter if not exists for the period
    if (!meter) {
      const now = new Date();
      const endOfPeriod = new Date();
      endOfPeriod.setMonth(endOfPeriod.getMonth() + 1);
      
      meter = UsageMeterEntity.create(
        command.customerId,
        command.featureId,
        now,
        endOfPeriod
      );
    }

    meter.record(command.amount);

    await this.repository.save(meter);
    await this.eventBus.publish(new UsageRecordedEvent(meter.id, command.customerId, command.amount));

    return meter.id;
  }
}
