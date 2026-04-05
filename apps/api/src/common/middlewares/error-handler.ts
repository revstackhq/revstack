import type { ErrorHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import { DomainError } from "@revstackhq/core";

/**
 * Global Error Handler middleware for Hono.
 * Captures all unhandled exceptions, logs them internally, and returns a safe,
 * standardized JSON response to the client.
 * 
 * Prevents sensitive infrastructure errors (like SQL queries) from leaking.
 */
export const globalErrorHandler: ErrorHandler = (err, c) => {
  // 1. Internal logging (can be hooked to Sentry, Datadog or standard console)
  console.error(`[GlobalErrorHandler] ${err.name}:`, err.message);

  // 2. Is it a business error that we threw on purpose? (e.g., ConflictError)
  if (err instanceof DomainError) {
    return c.json({
      error: {
        code: err.code,
        message: err.message,
      }
    }, err.statusCode as any); // Hono requires casting custom status codes
  }

  // 3. Is it a native Hono exception? (e.g., 404 Route Not Found, Validation Error)
  if (err instanceof HTTPException) {
    return c.json({
      error: {
        code: "HTTP_EXCEPTION",
        message: err.message,
      }
    }, err.status);
  }

  // 4. Security Wall: Generic 500 Internal Server Error
  // If it reaches this point, the database failed, Redis crashed, or there is a code bug.
  // NEVER return the raw `err.message` to avoid leaking credentials or SQL schemas!
  return c.json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred. Our engineers have been notified."
    }
  }, 500);
};
