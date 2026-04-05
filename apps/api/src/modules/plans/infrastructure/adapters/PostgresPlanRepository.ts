import type { PlanRepository } from "@revstackhq/core";
import type { PlanEntity } from "@revstackhq/core";

export class PostgresPlanRepository implements PlanRepository {
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
