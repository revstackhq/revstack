import { BadRequestError } from "@/domain/base/DomainError";

export class IntegrationDomainError extends BadRequestError {
  constructor(message: string, code: string) {
    super(message, code);
    this.name = "IntegrationDomainError";
  }
}

export class IntegrationProviderRequiredError extends IntegrationDomainError {
  constructor() {
    super("Integration provider is required", "INTEGRATION_PROVIDER_REQUIRED");
  }
}

export class IntegrationAlreadyInactiveError extends IntegrationDomainError {
  constructor(id: string) {
    super(
      `Integration ${id} is already inactive or uninstalled`,
      "INTEGRATION_ALREADY_INACTIVE",
    );
  }
}

export class InvalidIntegrationConfigError extends IntegrationDomainError {
  constructor(message: string) {
    super(message, "INVALID_INTEGRATION_CONFIG");
  }
}
