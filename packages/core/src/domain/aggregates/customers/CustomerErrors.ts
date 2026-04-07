import { NotFoundError, ConflictError, BadRequestError } from "@/domain/base/DomainError";

export class CustomerNotFoundError extends NotFoundError {
  constructor(identifier: string) {
    super(`Customer '${identifier}' was not found.`, "CUSTOMER_NOT_FOUND");
  }
}

export class CustomerAlreadyExistsError extends ConflictError {
  constructor(identifier: string) {
    super(`Customer '${identifier}' already exists.`, "CUSTOMER_ALREADY_EXISTS");
  }
}

export class CustomerAlreadyArchivedError extends BadRequestError {
  constructor(id: string) {
    super(`Customer '${id}' is already archived.`, "CUSTOMER_ALREADY_ARCHIVED");
  }
}
