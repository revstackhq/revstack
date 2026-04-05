import { DomainError } from "@/domain/base/DomainError";

export class IntegrationNotFoundError extends DomainError {
  constructor() {
    super("Integration not found", 404, "INTEGRATION_NOT_FOUND");
  }
}
