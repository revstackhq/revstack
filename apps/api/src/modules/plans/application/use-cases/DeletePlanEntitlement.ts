import type { PlanEntitlementRepository } from "@revstackhq/core";
import type { EventBus } from "@/common/application/ports/EventBus";
import { PlanEntitlementNotFoundError } from "@revstackhq/core";

export interface DeletePlanEntitlementCommand {
  planId: string;
  entitlementId: string;
}

export class DeletePlanEntitlementHandler {
  constructor(
    private readonly repository: PlanEntitlementRepository,
    private readonly eventBus: EventBus
  ) {}

  public async execute(command: DeletePlanEntitlementCommand) {
    const planEntitlement = await this.repository.findByPlanAndEntitlement(command.planId, command.entitlementId);
    if (!planEntitlement) {
      throw new PlanEntitlementNotFoundError();
    }

    await this.repository.delete(planEntitlement.id);
    await this.eventBus.publish({ eventName: "plan_entitlement.deleted", id: planEntitlement.id, planId: command.planId });

    return { success: true };
  }
}
