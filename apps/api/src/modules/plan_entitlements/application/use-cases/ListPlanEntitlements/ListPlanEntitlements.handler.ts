import type { PlanEntitlementRepository } from "@/modules/plan_entitlements/application/ports/PlanEntitlementRepository";
import type { ListPlanEntitlementsQuery } from "./ListPlanEntitlements.schema";

export class ListPlanEntitlementsHandler {
  constructor(private readonly repository: PlanEntitlementRepository) {}

  public async execute(query: ListPlanEntitlementsQuery) {
    const planEntitlements = await this.repository.find({
      planId: query.planId,
    });
    return planEntitlements.map(pe => pe.val);
  }
}
