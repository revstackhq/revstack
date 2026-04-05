import { DomainError } from "@/domain/base/DomainError";

// --- Plan Errors ---

export class PlanNotFoundError extends Error {
  constructor(id: string) {
    super(`Plan with ID ${id} was not found.`);
    this.name = "PlanNotFoundError";
  }
}

export class PlanAlreadyArchivedError extends Error {
  constructor(id: string) {
    super(`Plan with ID ${id} is already archived.`);
    this.name = "PlanAlreadyArchivedError";
  }
}

// --- Plan Entitlement Errors ---

export class PlanEntitlementNotFoundError extends DomainError {
  constructor() {
    super("Plan Entitlement not found", 404, "PLAN_ENTITLEMENT_NOT_FOUND");
  }
}
