import { DomainError } from "@/domain/base/DomainError";

export class EnvironmentNotFoundError extends DomainError {
  constructor() {
    super("Environment not found", 404, "ENV_NOT_FOUND");
  }
}
