import { BadRequestError, NotFoundError } from "@/domain/base/DomainError";

export class EntitlementNotFoundError extends NotFoundError {
  constructor(id?: string) {
    super(id ? `Entitlement with ID ${id} was not found.` : "Entitlement not found.", "ENTITLEMENT_NOT_FOUND");
  }
}

export class EntitlementAlreadyArchivedError extends BadRequestError {
  constructor(id: string) {
    super(`Entitlement with ID ${id} is already archived.`, "ENTITLEMENT_ALREADY_ARCHIVED");
  }
}

export class InvalidEntitlementOperationError extends BadRequestError {
  constructor(message: string) {
    super(message, "INVALID_ENTITLEMENT_OPERATION");
  }
}
