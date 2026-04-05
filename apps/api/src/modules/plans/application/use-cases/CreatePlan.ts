import { z } from "zod";
import type { PlanRepository } from "@revstackhq/core";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { CacheService } from "@/common/application/ports/CacheService";
import { PlanEntity } from "@revstackhq/core";
import { PlanCreatedEvent } from "@revstackhq/core";

export const createPlanSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  currency: z.string().length(3).optional(),
});

export type CreatePlanCommand = z.infer<typeof createPlanSchema>;

export class CreatePlanHandler {
  constructor(
    private readonly repository: PlanRepository,
    private readonly eventBus: EventBus,
    private readonly cache: CacheService
  ) {}

  public async execute(command: CreatePlanCommand): Promise<string> {
    const plan = PlanEntity.create(command.name, command.description, command.currency);

    await this.repository.save(plan);
    await this.cache.invalidate("plans_list");
    await this.eventBus.publish(new PlanCreatedEvent(plan.id));

    return plan.id;
  }
}
