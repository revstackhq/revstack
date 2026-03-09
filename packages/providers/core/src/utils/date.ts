/**
 * Utility functions for standardizing date and time operations across the Revstack PDK.
 * Resolves common impedance mismatches between provider formats (e.g., Unix seconds)
 * and native JavaScript Date objects.
 */

/**
 * Converts a Unix timestamp in seconds (commonly used by Stripe and Polar)
 * into a native JavaScript Date object (which operates in milliseconds).
 *
 * @param seconds - The Unix timestamp in seconds.
 * @returns A native JavaScript Date object.
 */
export function fromUnixSeconds(seconds: number): Date {
  return new Date(seconds * 1000);
}

/**
 * Converts a native JavaScript Date object into a Unix timestamp in seconds.
 * Essential for outbound API requests to providers that expect epoch seconds.
 *
 * @param date - The native JavaScript Date object.
 * @returns The Unix timestamp in seconds, rounded down to the nearest integer.
 */
export function toUnixSeconds(date: Date): number {
  return Math.floor(date.getTime() / 1000);
}

/**
 * Safely parses heterogeneous date inputs from various providers into a guaranteed
 * native JavaScript Date object. Handles ISO strings, Unix milliseconds, and existing Dates.
 *
 * @param input - The date payload from the provider (string, number, or Date).
 * @returns A native JavaScript Date object, or null if the input is completely invalid.
 */
export function parseDateSafe(
  input: string | number | Date | null | undefined,
): Date | null {
  if (!input) return null;
  if (input instanceof Date) return isNaN(input.getTime()) ? null : input;

  const parsed = new Date(input);
  return isNaN(parsed.getTime()) ? null : parsed;
}

/**
 * Checks if a given date has already passed relative to the current UTC time.
 * Useful for validating expired checkout sessions or mandates.
 *
 * @param date - The Date object to check.
 * @returns True if the date is in the past, false otherwise.
 */
export function isExpired(date: Date): boolean {
  return date.getTime() < Date.now();
}

/**
 * Adds a specific number of days to a given Date object.
 * Useful for calculating trial end dates or grace periods.
 *
 * @param date - The starting Date object.
 * @param days - The number of days to add.
 * @returns A new Date object offset by the specified days.
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Calculates the exact duration in seconds between two Date objects.
 * Often required by providers for setting precise expiration timers on checkout sessions.
 *
 * @param start - The beginning Date.
 * @param end - The ending Date.
 * @returns The absolute difference in seconds.
 */
export function diffInSeconds(start: Date, end: Date): number {
  return Math.abs(Math.floor((end.getTime() - start.getTime()) / 1000));
}

/**
 * Generates the current UTC timestamp in Unix seconds.
 * Standardizes 'Now' across all provider implementations to prevent
 * milliseconds/seconds mismatch errors during API calls.
 * * @returns The current Unix timestamp in seconds.
 */
export function currentUnixSeconds(): number {
  return Math.floor(Date.now() / 1000);
}