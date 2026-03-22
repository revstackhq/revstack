import type { IPlanRepository } from "@/modules/plans/application/ports/IPlanRepository";
import type { PlanEntity } from "@/modules/plans/domain/PlanEntity";

export class PostgresPlanRepo implements IPlanRepository {
  constructor(private readonly db: any) {}

  async save(plan: PlanEntity): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async findById(id: string): Promise<PlanEntity | null> {
    throw new Error("Method not implemented.");
  }

  async findAll(): Promise<PlanEntity[]> {
    throw new Error("Method not implemented.");
  }
}
