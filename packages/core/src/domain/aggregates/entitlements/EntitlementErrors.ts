import { BadRequestError } from "@/domain/base/DomainError";

export class EntitlementDomainError extends BadRequestError {
  constructor(message: string, code: string) {
    super(message, code);
    this.name = "EntitlementDomainError";
  }
}

export class EntitlementAlreadyArchivedError extends EntitlementDomainError {
  constructor(id: string) {
    super(
      `Entitlement with ID ${id} is already archived.`,
      "ENTITLEMENT_ALREADY_ARCHIVED",
    );
  }
}

export class InvalidEntitlementOperationError extends EntitlementDomainError {
  constructor(message: string) {
    super(message, "INVALID_ENTITLEMENT_OPERATION");
  }
}
