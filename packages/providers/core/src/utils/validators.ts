import { RevstackError, RevstackErrorCode } from "@/types/errors";

/**
 * Defines the specific constraints imposed by an underlying payment provider.
 * Passed into validators by the adapters.
 */
export interface TrialConstraints {
  /** A list of valid interval strings (e.g., ['month', 'year']) */
  allowedIntervals?: string[];
  /** The minimum allowable count for the trial duration */
  minCount?: number;
}

/**
 * Validates a trial configuration against an agnostic set of constraints.
 * * The Core is completely blind to which provider is currently being used. Instead,
 * the provider-specific adapter passes its own limitations (e.g., Polar only accepts
 * 'month' or 'year' intervals) into this function. If constraints are violated,
 * it immediately halts execution before making a costly network request.
 * * @param interval - The time unit for the trial (e.g., 'day', 'week', 'month').
 * @param count - The numerical duration of the trial.
 * @param constraints - The limitations defined by the calling provider adapter.
 * @throws {RevstackError} If the configuration violates the provided constraints.
 * * @example
 * ```ts
 * // Within the Polar adapter:
 * validateTrialConfig('day', 14, { allowedIntervals: ['month', 'year'] });
 * // Throws RevstackError: "Interval 'day' is not supported..."
 * ```
 */
export function validateTrialConfig(
  interval: string,
  count: number,
  constraints: TrialConstraints,
): void {
  if (constraints.minCount !== undefined && count < constraints.minCount) {
    throw new RevstackError({
      code: RevstackErrorCode.InvalidTrial,
      message: `Trial count cannot be less than ${constraints.minCount}.`,
    });
  }

  if (
    constraints.allowedIntervals &&
    !constraints.allowedIntervals.includes(interval)
  ) {
    throw new RevstackError({
      code: RevstackErrorCode.UnsupportedInterval,
      message: `Interval '${interval}' is not supported. Allowed: ${constraints.allowedIntervals.join(", ")}`,
    });
  }
}
