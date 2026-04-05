import type { PlanRepository } from "@revstackhq/core";
import { NotFoundError, DomainError } from "@revstackhq/core";

export interface HidePlanCommand {
  id: string;
}

export class HidePlanHandler {
  constructor(private readonly repository: PlanRepository) {}

  public async execute(command: HidePlanCommand): Promise<void> {
    const plan = await this.repository.findById(command.id);
    if (!plan) {
      throw new NotFoundError("Plan not found", "PLAN_NOT_FOUND");
    }

    try {
      plan.hide();
    } catch (err: any) {
      throw new DomainError(err.message, 400, "PLAN_ALREADY_HIDDEN");
    }

    await this.repository.save(plan);
  }
}
