import { createHash } from "crypto";

/**
 * Generates a deterministic idempotency key based on the execution context and payload.
 * * Idempotency keys are crucial in financial infrastructure to prevent double-charging
 * a customer in the event of network timeouts or automatic retries. By hashing the payload,
 * we ensure that identical requests yield the exact same key.
 * * @param context - A unique string representing the action or context (e.g., 'sub_create', 'order_refund').
 * @param payload - The exact data payload being sent to the provider.
 * @returns A safe, 32-character deterministic string starting with `idem_`.
 * * @example
 * ```ts
 * const key = generateIdempotencyKey('checkout_session', { amount: 1000, customer: 'cus_123' });
 * // Returns 'idem_a1b2c3d4e5f6g7h8i9j0k1l2m3n'
 * ```
 */
export function generateIdempotencyKey(
  context: string,
  payload: unknown,
): string {
  const dataString = JSON.stringify(payload);
  const hash = createHash("sha256")
    .update(`${context}:${dataString}`)
    .digest("hex");

  return `idem_${hash.substring(0, 27)}`;
}
