import type { PlanEntitlementRepository } from "@/modules/plan_entitlements/application/ports/PlanEntitlementRepository";
import type { ListPlanEntitlementsQuery } from "@/modules/plan_entitlements/application/queries/ListPlanEntitlementsQuery";

export class ListPlanEntitlementsHandler {
  constructor(private readonly repository: PlanEntitlementRepository) {}

  public async handle(query: ListPlanEntitlementsQuery) {
    const planEntitlements = await this.repository.find({
      planId: query.planId,
    });
    return planEntitlements.map(pe => pe.toPrimitives());
  }
}
