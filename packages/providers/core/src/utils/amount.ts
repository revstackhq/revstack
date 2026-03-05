/**
 * Converts a UI-facing decimal amount into the smallest integer unit required by most payment providers.
 * * This function mitigates standard JavaScript floating-point precision issues
 * (e.g., `0.1 + 0.2 === 0.30000000000000004`) by properly rounding the mathematical result.
 * * @param amount - The decimal representation of the currency amount (e.g., 10.50 for $10.50).
 * @returns The integer representation in the currency's smallest unit (e.g., 1050 for 1050 cents).
 * * @example
 * ```ts
 * const cents = toProviderAmount(19.99); // Returns 1999
 * ```
 */
export function toProviderAmount(amount: number): number {
  return Math.round(amount * 100);
}

/**
 * Converts a provider's smallest integer unit (e.g., cents) back into a UI-facing decimal amount.
 * * @param amount - The integer representation from the provider (e.g., 1050).
 * @returns The decimal representation formatted to two decimal places as a number (e.g., 10.50).
 * * @example
 * ```ts
 * const displayAmount = fromProviderAmount(1999); // Returns 19.99
 * ```
 */
export function fromProviderAmount(amount: number): number {
  return Number((amount / 100).toFixed(2));
}
