/**
 * Calculates the completion progress of a billing cycle as a float between 0 and 1.
 * * This is primarily used for manual proration calculations when a provider does not
 * natively support it, or when determining unused time credits for upgrades/downgrades.
 * * @param startDate - The start date of the billing cycle.
 * @param endDate - The end date of the billing cycle.
 * @param currentDate - The reference date to calculate progress against (defaults to `new Date()`).
 * @returns A float between `0.0` (cycle hasn't started) and `1.0` (cycle has ended).
 * * @example
 * ```ts
 * const progress = calculateCycleProgress(new Date('2026-03-01'), new Date('2026-03-31'), new Date('2026-03-15'));
 * // Returns ~0.46 (approx 46% of the cycle is complete)
 * ```
 */
export function calculateCycleProgress(
  startDate: Date,
  endDate: Date,
  currentDate: Date = new Date(),
): number {
  const start = startDate.getTime();
  const end = endDate.getTime();
  const now = currentDate.getTime();

  if (now <= start) return 0;
  if (now >= end) return 1;

  return (now - start) / (end - start);
}
