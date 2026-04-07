import { DomainError } from "@/domain/base/DomainError";

// --- Addon Errors ---

export class AddonNotFoundError extends DomainError {
  constructor() {
    super("Addon not found", 404, "ADDON_NOT_FOUND");
  }
}

export class AddonAlreadyArchivedError extends DomainError {
  constructor(id: string) {
    super(`Addon with ID ${id} is already archived.`, 400, "ADDON_ALREADY_ARCHIVED");
  }
}

// --- Addon Entitlement Errors ---

export class AddonEntitlementNotFoundError extends DomainError {
  constructor() {
    super("Addon Entitlement not found", 404, "ADDON_ENTITLEMENT_NOT_FOUND");
  }
}

export class InvalidEntitlementTypeError extends DomainError {
  constructor(entitlementSlug: string) {
    super(
      `Cannot use 'increment' type for boolean entitlement '${entitlementSlug}'.`,
      400,
      "INVALID_ENTITLEMENT_TYPE"
    );
  }
}

export class EntitlementNotFoundError extends DomainError {
  constructor(entitlementId: string) {
    super(
      `Entitlement with ID ${entitlementId} not found in addon.`,
      404,
      "ENTITLEMENT_NOT_FOUND"
    );
  }
}
