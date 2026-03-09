/**
 * Universal utility to aggregate financial totals from a list of invoice line items.
 * Splits items into "Immediate Charges" (adjustments/prorations) and
 * "New Recurring Totals" (the future baseline cost).
 * * @param lines - The array of unified or raw line items.
 * @param checkIsProration - A provider-specific predicate to identify proration lines.
 * @returns A breakdown of the financial impact.
 */
export function calculateProrationBreakdown<T>(
  lines: T[],
  checkIsProration: (line: T) => boolean,
  getAmount: (line: T) => number,
): { immediateCharge: number; recurringTotal: number } {
  return lines.reduce(
    (acc, line) => {
      if (checkIsProration(line)) {
        acc.immediateCharge += getAmount(line);
      } else {
        acc.recurringTotal += getAmount(line);
      }
      return acc;
    },
    { immediateCharge: 0, recurringTotal: 0 },
  );
}
