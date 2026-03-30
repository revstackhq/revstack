import type { PlanEntitlementRepository } from "@/modules/plan_entitlements/application/ports/PlanEntitlementRepository";
import type { GetPlanEntitlementQuery } from "./GetPlanEntitlement.schema";
import { PlanEntitlementNotFoundError } from "@/modules/plan_entitlements/domain/PlanEntitlementErrors";

export class GetPlanEntitlementHandler {
  constructor(private readonly repository: PlanEntitlementRepository) {}

  public async execute(query: GetPlanEntitlementQuery) {
    const planEntitlement = await this.repository.findByPlanAndEntitlement(query.planId, query.entitlementId);
    if (!planEntitlement) {
      throw new PlanEntitlementNotFoundError();
    }
    return planEntitlement.val;
  }
}
