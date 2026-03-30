import type { PlanEntitlementRepository } from "@/modules/plan_entitlements/application/ports/PlanEntitlementRepository";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { UpdatePlanEntitlementLimitsCommand } from "./UpdatePlanEntitlementLimits.schema";
import { PlanEntitlementNotFoundError } from "@/modules/plan_entitlements/domain/PlanEntitlementErrors";

export class UpdatePlanEntitlementLimitsHandler {
  constructor(
    private readonly repository: PlanEntitlementRepository,
    private readonly eventBus: EventBus
  ) {}

  public async execute(command: UpdatePlanEntitlementLimitsCommand) {
    const planEntitlement = await this.repository.findByPlanAndEntitlement(command.planId, command.entitlementId);
    if (!planEntitlement) {
      throw new PlanEntitlementNotFoundError();
    }

    planEntitlement.updateLimits(command.limit);

    await this.repository.save(planEntitlement);
    await this.eventBus.publish({ eventName: "plan_entitlement.updated", id: planEntitlement.id, planId: command.planId });

    return planEntitlement.val;
  }
}
