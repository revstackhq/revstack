import { z } from "zod";
import type { UsageRepository } from "@revstackhq/core";
import type { EventBus } from "@/common/application/ports/EventBus";
import { DomainError } from "@revstackhq/core";

export const updateUsageMeterSchema = z.object({
  periodStart: z.string().datetime().optional(),
  periodEnd: z.string().datetime().optional(),
});

export type UpdateUsageMeterCommand = {
  id: string;
} & z.infer<typeof updateUsageMeterSchema>;

export class UpdateUsageMeterHandler {
  constructor(
    private readonly repository: UsageRepository,
    private readonly eventBus: EventBus
  ) {}

  public async execute(command: UpdateUsageMeterCommand) {
    const meter = await this.repository.findMeterById(command.id);
    if (!meter) {
      throw new DomainError("Usage meter not found", 404, "METER_NOT_FOUND");
    }

    if (command.periodStart) meter.periodStart = new Date(command.periodStart);
    if (command.periodEnd) meter.periodEnd = new Date(command.periodEnd);

    await this.repository.save(meter);
    await this.eventBus.publish({ eventName: "usage_meter.updated", id: meter.id, customerId: meter.customerId });

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
