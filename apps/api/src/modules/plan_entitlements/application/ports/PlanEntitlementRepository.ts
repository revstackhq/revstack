import type { PlanEntitlementEntity } from "@/modules/plan_entitlements/domain/PlanEntitlementEntity";

export interface PlanEntitlementRepository {
  save(planEntitlement: PlanEntitlementEntity): Promise<string>;
  findByPlanAndEntitlement(
    planId: string,
    entitlementId: string,
  ): Promise<PlanEntitlementEntity | null>;
  find(filters: { planId?: string }): Promise<PlanEntitlementEntity[]>;
  delete(id: string): Promise<boolean>;
}
