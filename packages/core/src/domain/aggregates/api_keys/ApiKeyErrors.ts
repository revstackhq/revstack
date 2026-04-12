import { BadRequestError } from "@/domain/base/DomainError";

export class ApiKeyDomainError extends BadRequestError {
  constructor(message: string, code: string) {
    super(message, code);
    this.name = "ApiKeyDomainError";
  }
}

export class ApiKeyRevokedError extends ApiKeyDomainError {
  constructor(id: string) {
    super(
      `API Key ${id} has been revoked and can no longer be used.`,
      "API_KEY_REVOKED",
    );
  }
}

export class ApiKeyExpiredError extends ApiKeyDomainError {
  constructor(id: string) {
    super(
      `API Key ${id} has expired and is no longer valid.`,
      "API_KEY_EXPIRED",
    );
  }
}

export class ApiKeyScopeError extends ApiKeyDomainError {
  constructor(requiredScope: string) {
    super(
      `Insufficient permissions. Required scope: ${requiredScope}`,
      "INSUFFICIENT_SCOPES",
    );
  }
}
