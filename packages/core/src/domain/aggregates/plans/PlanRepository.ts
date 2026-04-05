import type { PlanEntity } from "@/domain/aggregates/plans/PlanEntity";

export interface PlanRepository {
  save(plan: PlanEntity): Promise<void>;
  findById(id: string): Promise<PlanEntity | null>;
  findAll(): Promise<PlanEntity[]>;
}
