import { BadRequestError } from "@/domain/base/DomainError";

export class IdentityProviderDomainError extends BadRequestError {
  constructor(message: string, code: string) {
    super(message, code);
    this.name = "IdentityProviderDomainError";
  }
}

export class MissingConfigurationError extends IdentityProviderDomainError {
  constructor(field: string, strategy: string) {
    super(
      `${field} is mandatory for ${strategy} strategy.`,
      `MISSING_${field.toUpperCase()}`,
    );
  }
}

export class InvalidStrategyChangeError extends IdentityProviderDomainError {
  constructor() {
    super(
      "Cannot switch strategy without providing the required configuration (JWKS URI or Secret).",
      "INVALID_STRATEGY_CHANGE",
    );
  }
}
