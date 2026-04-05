import { DomainError } from "@/domain/base/DomainError";

// --- Addon Errors ---

export class AddonNotFoundError extends DomainError {
  constructor() {
    super("Addon not found", 404, "ADDON_NOT_FOUND");
  }
}

// --- Addon Entitlement Errors ---

export class AddonEntitlementNotFoundError extends DomainError {
  constructor() {
    super("Addon Entitlement not found", 404, "ADDON_ENTITLEMENT_NOT_FOUND");
  }
}
