import {
  AsyncActionResult,
  ProviderContext,
  CapturePaymentInput,
  RevstackErrorCode,
} from "@revstackhq/providers-core";

/**
 * Captures an uncaptured Polar payment. Returns NotImplemented as Polar does not support this manually.
 *
 * @param _ctx - Unused provider context.
 * @param _input - Unused payload.
 * @returns A NotImplemented Error.
 */
export const capturePayment = async (
  _ctx: ProviderContext,
  _input: CapturePaymentInput,
): Promise<AsyncActionResult<string>> => {
  return {
    data: null,
    status: "failed",
    error: {
      code: RevstackErrorCode.NotImplemented,
      message: "Manual capture is not supported by Polar logic yet.",
    },
  };
};
