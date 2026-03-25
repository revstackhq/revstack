import { DomainError } from "@/common/errors/DomainError";

export class AuthConfigNotFoundError extends DomainError {
  constructor() {
    super("Auth configuration not found", 404, "AUTH_CONFIG_NOT_FOUND");
  }
}
