import { DomainError } from "@/domain/base/DomainError";

export class UserNotFoundError extends DomainError {
  constructor() {
    super("User not found", 404, "USER_NOT_FOUND");
  }
}

export class UserAlreadyExistsError extends DomainError {
  constructor() {
    super("A user with this email already exists in this environment", 409, "USER_ALREADY_EXISTS");
  }
}
