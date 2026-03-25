import { DomainError } from "@/common/errors/DomainError";

export class AddonEntitlementNotFoundError extends DomainError {
  constructor() {
    super("Addon Entitlement not found", 404, "ADDON_ENTITLEMENT_NOT_FOUND");
  }
}
