import type { PlanRepository } from "@revstackhq/core";
import { NotFoundError, DomainError } from "@revstackhq/core";

export interface ArchivePlanCommand {
  id: string;
}

export class ArchivePlanHandler {
  constructor(private readonly repository: PlanRepository) {}

  public async execute(command: ArchivePlanCommand): Promise<void> {
    const plan = await this.repository.findById(command.id);
    if (!plan) {
      throw new NotFoundError("Plan not found", "PLAN_NOT_FOUND");
    }

    try {
      plan.archive();
    } catch (err: any) {
      throw new DomainError(err.message, 400, "PLAN_ALREADY_ARCHIVED");
    }

    await this.repository.save(plan);
  }
}
