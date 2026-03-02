import { RevstackErrorCode } from "@revstackhq/providers-core";

//
/**
 * Maps provider error to Revstack error.
 *
 * @param error - The provider error.
 * @returns The mapped Revstack error.
 */
export function mapError(error: any): {
  code: RevstackErrorCode;
  message: string;
  providerError?: string;
} {
  const msg = error?.message || "Unknown error";
  const name = error?.name || "Error";

  if (error.status === 404) {
    return {
      code: RevstackErrorCode.ResourceNotFound,
      message: msg,
      providerError: name,
    };
  }

  if (error.status === 401 || error.status === 403) {
    return {
      code: RevstackErrorCode.InvalidCredentials,
      message: msg,
      providerError: name,
    };
  }

  if (error.status >= 500) {
    return {
      code: RevstackErrorCode.ProviderUnavailable,
      message: msg,
      providerError: name,
    };
  }

  return {
    code: RevstackErrorCode.UnknownError,
    message: msg,
    providerError: name,
  };
}
