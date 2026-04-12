import { BadRequestError } from "@/domain/base";

export class CustomerDomainError extends BadRequestError {
  constructor(message: string, code: string) {
    super(message, code);
    this.name = "CustomerDomainError";
  }
}

export class CustomerAlreadyArchivedError extends CustomerDomainError {
  constructor(id: string) {
    super(`Customer '${id}' is already archived.`, "CUSTOMER_ALREADY_ARCHIVED");
  }
}

export class InvalidCustomerEmailError extends CustomerDomainError {
  constructor(email: string) {
    super(
      `The email '${email}' is not a valid email address.`,
      "INVALID_CUSTOMER_EMAIL",
    );
  }
}

export class InvalidCurrencyError extends CustomerDomainError {
  constructor(currency: string) {
    super(
      `Currency '${currency}' is not supported or invalid. Use ISO 3-letter codes.`,
      "INVALID_CURRENCY",
    );
  }
}

export class MissingRequiredFieldError extends CustomerDomainError {
  constructor(field: string) {
    super(
      `Field '${field}' is required for customer creation.`,
      "MISSING_REQUIRED_FIELD",
    );
  }
}
