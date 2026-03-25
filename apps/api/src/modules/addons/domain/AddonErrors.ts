import { DomainError } from "@/common/errors/DomainError";

export class AddonNotFoundError extends DomainError {
  constructor() {
    super("Addon not found", 404, "ADDON_NOT_FOUND");
  }
}
