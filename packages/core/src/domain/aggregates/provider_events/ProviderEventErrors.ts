import { DomainError } from "@/domain/base/DomainError";

export class ProviderEventNotFoundError extends DomainError {
  constructor() {
    super("Provider event not found", 404, "PROVIDER_EVENT_NOT_FOUND");
  }
}
