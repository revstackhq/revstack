import type { PlanRepository } from "@/modules/plans/application/ports/PlanRepository";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { CacheService } from "@/common/application/ports/CacheService";
import type { CreatePlanCommand } from "./CreatePlan.schema";
import { PlanEntity } from "@/modules/plans/domain/PlanEntity";
import { PlanCreatedEvent } from "@/modules/plans/domain/events/PlanCreatedEvent";

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
