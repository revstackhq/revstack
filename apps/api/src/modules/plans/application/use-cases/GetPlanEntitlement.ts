import type { PlanEntitlementRepository } from "@revstackhq/core";
import { PlanEntitlementNotFoundError } from "@revstackhq/core";

export interface GetPlanEntitlementQuery {
  planId: string;
  entitlementId: string;
}

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
