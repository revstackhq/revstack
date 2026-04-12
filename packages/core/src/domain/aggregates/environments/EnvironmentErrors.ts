import { BadRequestError } from "@/domain/base/DomainError";

export class EnvironmentDomainError extends BadRequestError {
  constructor(message: string, code: string) {
    super(message, code);
    this.name = "EnvironmentDomainError";
  }
}

export class EnvironmentNameRequiredError extends EnvironmentDomainError {
  constructor() {
    super("Environment name is required", "ENVIRONMENT_NAME_REQUIRED");
  }
}

export class EnvironmentSlugRequiredError extends EnvironmentDomainError {
  constructor() {
    super("Environment slug is required", "ENVIRONMENT_SLUG_REQUIRED");
  }
}

export class ProtectedEnvironmentError extends EnvironmentDomainError {
  constructor(action: string) {
    super(
      `Cannot ${action} a default environment (sandbox/production)`,
      "PROTECTED_ENVIRONMENT",
    );
  }
}
