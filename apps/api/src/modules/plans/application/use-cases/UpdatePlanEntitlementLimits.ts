import { z } from "zod";
import type { PlanEntitlementRepository } from "@revstackhq/core";
import type { EventBus } from "@/common/application/ports/EventBus";
import { PlanEntitlementNotFoundError } from "@revstackhq/core";

export const updatePlanEntitlementLimitsSchema = z.object({
  limit: z.number().int().min(0).optional(),
});

export type UpdatePlanEntitlementLimitsCommand = {
  planId: string;
  entitlementId: string;
} & z.infer<typeof updatePlanEntitlementLimitsSchema>;

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
