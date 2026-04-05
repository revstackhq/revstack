import type { PlanEntitlementEntity } from "@/domain/aggregates/plans/PlanEntitlementEntity";

export interface PlanEntitlementRepository {
  save(planEntitlement: PlanEntitlementEntity): Promise<string>;
  findById(id: string): Promise<PlanEntitlementEntity>;
  findOne(filters: {
    planId?: string;
    entitlementId?: string;
  }): Promise<PlanEntitlementEntity>;
  find(filters: { planId?: string }): Promise<PlanEntitlementEntity[]>;
  delete(id: string): Promise<boolean>;
}
