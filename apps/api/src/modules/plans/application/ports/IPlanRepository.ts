import type { PlanEntity } from "@/modules/plans/domain/PlanEntity";

export interface IPlanRepository {
  save(plan: PlanEntity): Promise<void>;
  findById(id: string): Promise<PlanEntity | null>;
  findAll(): Promise<PlanEntity[]>;
}
