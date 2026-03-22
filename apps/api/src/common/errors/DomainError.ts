/**
 * Base abstract class for all domain-specific errors.
 * Ensures an HTTP status code and an internal business code are always present.
 */
export class DomainError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number,
    public readonly code: string
  ) {
    super(message);
    this.name = this.constructor.name;
    // Captures the stack trace for internal debugging (e.g., Sentry, Datadog)
    Error.captureStackTrace(this, this.constructor);
  }
}

// --- Specific Errors (Reusable across all modules) ---

/**
 * Thrown when a resource already exists or conflicts with current state.
 * Translates to HTTP 409 Conflict.
 */
export class ConflictError extends DomainError {
  constructor(message: string, code: string = 'CONFLICT') {
    super(message, 409, code);
  }
}

/**
 * Thrown when a requested resource is not found.
 * Translates to HTTP 404 Not Found.
 */
export class NotFoundError extends DomainError {
  constructor(message: string, code: string = 'NOT_FOUND') {
    super(message, 404, code);
  }
}

/**
 * Thrown when the client's request is invalid.
 * Translates to HTTP 400 Bad Request.
 */
export class BadRequestError extends DomainError {
  constructor(message: string, code: string = 'BAD_REQUEST') {
    super(message, 400, code);
  }
}
