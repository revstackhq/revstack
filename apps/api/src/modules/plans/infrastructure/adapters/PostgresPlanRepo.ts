import type { PlanRepository } from "@/modules/plans/application/ports/PlanRepository";
import type { PlanEntity } from "@/modules/plans/domain/PlanEntity";

export class PostgresPlanRepo implements PlanRepository {
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
