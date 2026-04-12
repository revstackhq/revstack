import { BadRequestError } from "@/domain/base/DomainError";

export class ProviderEventDomainError extends BadRequestError {
  constructor(message: string, code: string) {
    super(message, code);
    this.name = "ProviderEventDomainError";
  }
}

export class ProviderEventAlreadyProcessedError extends ProviderEventDomainError {
  constructor(externalId: string) {
    super(
      `Provider event ${externalId} has already been processed`,
      "EVENT_ALREADY_PROCESSED",
    );
  }
}

export class InvalidProviderEventDataError extends ProviderEventDomainError {
  constructor(message: string) {
    super(message, "INVALID_EVENT_DATA");
  }
}
