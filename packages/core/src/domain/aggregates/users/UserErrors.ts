import { BadRequestError } from "@/domain/base/DomainError";

export class UserDomainError extends BadRequestError {
  constructor(message: string, code: string) {
    super(message, code);
    this.name = "UserDomainError";
  }
}

export class InvalidUserEmailError extends UserDomainError {
  constructor(email: string) {
    super(`The email address '${email}' is not valid.`, "INVALID_USER_EMAIL");
  }
}

export class UserEnvironmentRequiredError extends UserDomainError {
  constructor() {
    super("Users must be associated with an environment.", "USER_ENV_REQUIRED");
  }
}

export class UserAlreadyInactiveError extends UserDomainError {
  constructor(userId: string) {
    super(`User ${userId} is already inactive.`, "USER_ALREADY_INACTIVE");
  }
}
