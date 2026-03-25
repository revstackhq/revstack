import { DomainError } from "@/common/errors/DomainError";

export class PlanEntitlementNotFoundError extends DomainError {
  constructor() {
    super("Plan Entitlement not found", 404, "PLAN_ENTITLEMENT_NOT_FOUND");
  }
}
