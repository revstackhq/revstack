import type { UsageRepository } from "@/modules/usage/application/ports/UsageRepository";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { RecordUsageCommand } from "@/modules/usage/application/commands/RecordUsageCommand";
import { UsageRecordedEvent } from "@/modules/usage/domain/events/UsageRecordedEvent";
import { UsageMeterEntity } from "@/modules/usage/domain/UsageMeterEntity";

export class RecordUsageHandler {
  constructor(
    private readonly repository: UsageRepository,
    private readonly eventBus: EventBus
  ) {}

  public async handle(command: RecordUsageCommand): Promise<string> {
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
