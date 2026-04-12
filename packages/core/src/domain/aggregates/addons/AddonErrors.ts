import { BadRequestError } from "@/domain/base/DomainError";

export class AddonDomainError extends BadRequestError {
  constructor(message: string, code: string) {
    super(message, code);
    this.name = "AddonDomainError";
  }
}

// --- Addon Errors ---

export class AddonAlreadyArchivedError extends AddonDomainError {
  constructor(id: string) {
    super(`Addon with ID ${id} is already archived.`, "ADDON_ALREADY_ARCHIVED");
  }
}

// --- Addon Entitlement Errors ---

export class InvalidEntitlementTypeError extends AddonDomainError {
  constructor(entitlementSlug: string) {
    super(
      `Cannot use 'increment' type for boolean entitlement '${entitlementSlug}'.`,
      "INVALID_ENTITLEMENT_TYPE",
    );
  }
}

export class AddonEntitlementDomainError extends AddonDomainError {
  constructor(message: string, code: string) {
    super(message, code);
    this.name = "AddonEntitlementDomainError";
  }
}

export class AddonEntitlementNotFoundError extends AddonEntitlementDomainError {
  constructor() {
    super("Addon Entitlement not found", "ADDON_ENTITLEMENT_NOT_FOUND");
  }
}
