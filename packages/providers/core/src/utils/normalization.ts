/**
 * Utility functions for normalizing payment and localization data across different providers.
 * Revstack Core standardizes on ISO 4217 for currencies and ISO 3166-1 alpha-2 for countries.
 */

/**
 * Normalizes a currency code to a standard ISO 4217 format.
 * Ensures the string is trimmed, sanitized, and formatted to the requested case.
 * * Payment gateways have conflicting requirements (e.g., Stripe requires lowercase,
 * while Polar/Paddle usually expect uppercase). This agnostic utility allows each
 * adapter to request its required format.
 *
 * @param currency - The raw currency string (e.g., "usd", "EUR ", "gbp").
 * @param format - The desired output case. Defaults to 'uppercase'.
 * @returns The normalized currency string.
 *
 * @example
 * // In Stripe Adapter:
 * normalizeCurrency("USD", "lowercase") // Returns "usd"
 * * @example
 * // In Polar Adapter:
 * normalizeCurrency("usd") // Returns "USD"
 */
export function normalizeCurrency(
  currency: string,
  format: "uppercase" | "lowercase" = "uppercase",
): string {
  if (!currency) return "";

  const sanitized = currency.trim();
  return format === "lowercase"
    ? sanitized.toLowerCase()
    : sanitized.toUpperCase();
}

/**
 * Normalizes a country code to the ISO 3166-1 alpha-2 standard.
 * Automatically converts common aliases (e.g., "UK" to "GB") and ensures
 * uppercase formatting, which is the standard accepted by 99% of payment gateways.
 *
 * @param country - The raw country string (e.g., "uk", "us ", "AR").
 * @returns The normalized 2-letter ISO country code.
 *
 * @example
 * normalizeCountry("uk") // Returns "GB"
 * normalizeCountry(" ar ") // Returns "AR"
 */
export function normalizeCountry(country: string): string {
  if (!country) return "";

  const upper = country.trim().toUpperCase();

  // Handle common non-ISO aliases that merchants or users might input
  const aliases: Record<string, string> = {
    UK: "GB",
  };

  return aliases[upper] || upper;
}
