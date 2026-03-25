import type { PlanRepository } from "@/modules/plans/application/ports/PlanRepository";
import type { ArchivePlanCommand } from "@/modules/plans/application/commands/ArchivePlanCommand";
import { NotFoundError, DomainError } from "@/common/errors/DomainError";

export class ArchivePlanHandler {
  constructor(private readonly repository: PlanRepository) {}

  public async handle(command: ArchivePlanCommand): Promise<void> {
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
