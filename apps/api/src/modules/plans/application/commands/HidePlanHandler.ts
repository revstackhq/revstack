import type { PlanRepository } from "@/modules/plans/application/ports/PlanRepository";
import type { HidePlanCommand } from "@/modules/plans/application/commands/HidePlanCommand";
import { NotFoundError, DomainError } from "@/common/errors/DomainError";

export class HidePlanHandler {
  constructor(private readonly repository: PlanRepository) {}

  public async handle(command: HidePlanCommand): Promise<void> {
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
