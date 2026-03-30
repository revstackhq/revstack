import type { PlanEntitlementRepository } from "@/modules/plan_entitlements/application/ports/PlanEntitlementRepository";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { CreatePlanEntitlementCommand } from "./CreatePlanEntitlement.schema";
import { PlanEntitlementEntity } from "@/modules/plan_entitlements/domain/PlanEntitlementEntity";
import { DomainError } from "@/common/errors/DomainError";

export class CreatePlanEntitlementHandler {
  constructor(
    private readonly repository: PlanEntitlementRepository,
    private readonly eventBus: EventBus
  ) {}

  public async execute(command: CreatePlanEntitlementCommand) {
    const existing = await this.repository.findByPlanAndEntitlement(command.planId, command.entitlementId);
    if (existing) {
        throw new DomainError("Plan already has this entitlement", 409, "ALREADY_EXISTS");
    }

    const planEntitlement = PlanEntitlementEntity.create(command);

    await this.repository.save(planEntitlement);
    await this.eventBus.publish({ eventName: "plan_entitlement.created", id: planEntitlement.id, planId: command.planId });

    return planEntitlement.val;
  }
}
