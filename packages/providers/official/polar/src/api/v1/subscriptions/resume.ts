import {
  AsyncActionResult,
  ProviderContext,
  ResumeSubscriptionInput,
  RevstackErrorCode,
} from "@revstackhq/providers-core";

/**
 * Resumes a Polar subscription. Returns a NotImplemented error.
 *
 * @param _ctx - Unused provider context.
 * @param _input - Unused ID.
 * @returns A NotImplemented Error.
 */
export async function resumeSubscription(
  _ctx: ProviderContext,
  _input: ResumeSubscriptionInput,
): Promise<AsyncActionResult<string>> {
  return {
    data: null,
    status: "failed",
    error: {
      code: RevstackErrorCode.NotImplemented,
      message: "Polar does not natively support resuming paused subscriptions.",
    },
  };
}
