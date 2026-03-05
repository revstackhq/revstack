import { IncomingHttpHeaders } from "http";

/**
 * Normalizes incoming HTTP headers into a flat, lowercase key-value record.
 * * Different serverless environments and frameworks (Next.js, Express, AWS Lambda)
 * parse HTTP headers differently. Some capitalize them, some group them in arrays.
 * This function guarantees a consistent format required for reliable cryptographic
 * signature verification across all provider adapters.
 * * @param headers - The raw headers object from the incoming HTTP request.
 * @returns A normalized `Record<string, string>` where all keys are lowercase and values are flat strings.
 * * @example
 * ```ts
 * const safeHeaders = normalizeHeaders({ 'Stripe-Signature': ['v1=123,t=456'], 'content-type': 'application/json' });
 * // Returns { 'stripe-signature': 'v1=123,t=456', 'content-type': 'application/json' }
 * ```
 */
export function normalizeHeaders(
  headers: IncomingHttpHeaders | Record<string, string | string[] | undefined>,
): Record<string, string> {
  const normalized: Record<string, string> = {};

  for (const [key, value] of Object.entries(headers)) {
    if (value !== undefined) {
      normalized[key.toLowerCase()] = Array.isArray(value)
        ? (value[0] ?? "")
        : String(value);
    }
  }

  return normalized;
}
