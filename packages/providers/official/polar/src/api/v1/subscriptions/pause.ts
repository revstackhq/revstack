import {
  AsyncActionResult,
  ProviderContext,
  PauseSubscriptionInput,
  RevstackErrorCode,
} from "@revstackhq/providers-core";

/**
 * Pauses a Polar subscription. Returns a NotImplemented error.
 *
 * @param _ctx - Unused provider context.
 * @param _input - Unused ID.
 * @returns A NotImplemented Error.
 */
export async function pauseSubscription(
  _ctx: ProviderContext,
  _input: PauseSubscriptionInput,
): Promise<AsyncActionResult<string>> {
  return {
    data: null,
    status: "failed",
    error: {
      code: RevstackErrorCode.NotImplemented,
      message: "Polar does not natively support pausing subscriptions yet.",
    },
  };
}
