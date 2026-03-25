import type { IPlanRepository } from "@/modules/plans/application/ports/IPlanRepository";
import type { IEventBus } from "@/common/application/ports/IEventBus";
import type { ICacheService } from "@/common/application/ports/ICacheService";
import type { CreatePlanCommand } from "@/modules/plans/application/commands/CreatePlanCommand";
import { PlanEntity } from "@/modules/plans/domain/PlanEntity";
import { PlanCreatedEvent } from "@/modules/plans/domain/events/PlanCreatedEvent";

export class CreatePlanHandler {
  constructor(
    private readonly repository: IPlanRepository,
    private readonly eventBus: IEventBus,
    private readonly cache: ICacheService
  ) {}

  public async handle(command: CreatePlanCommand): Promise<string> {
    const plan = PlanEntity.create(command.name, command.description, command.currency);

    await this.repository.save(plan);
    await this.cache.invalidate("plans_list");
    await this.eventBus.publish(new PlanCreatedEvent(plan.id));

    return plan.id;
  }
}
