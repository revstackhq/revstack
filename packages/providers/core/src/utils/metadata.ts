/**
 * Serializes a complex data object into a flat string-to-string dictionary,
 * enforcing maximum key counts and value lengths to comply with provider API limits.
 * * Payment providers (like Stripe) strictly limit the size and shape of metadata.
 * This function acts as a safety net, flattening nested objects via JSON stringification
 * and cleanly truncating values that exceed the limit, appending `...` to indicate truncation.
 * * @param data - The raw, potentially nested metadata object provided by the merchant.
 * @param keyLimit - The maximum number of keys allowed in the resulting metadata (default: 50).
 * @param valueLengthLimit - The maximum string length allowed for a single value (default: 500).
 * @returns A strictly formatted `Record<string, string>` safe for provider ingestion.
 * * @example
 * ```ts
 * const safeMeta = serializeMetadata({ userId: 123, preferences: { theme: 'dark' } });
 * // Returns { 'userId': '123', 'preferences': '{"theme":"dark"}' }
 * ```
 */
export function serializeMetadata(
  data: Record<string, unknown>,
  keyLimit = 50,
  valueLengthLimit = 500,
): Record<string, string> {
  const serialized: Record<string, string> = {};
  let keysCount = 0;

  for (const [key, value] of Object.entries(data)) {
    if (keysCount >= keyLimit) break;

    let stringValue =
      typeof value === "object" ? JSON.stringify(value) : String(value);

    if (stringValue.length > valueLengthLimit) {
      stringValue = stringValue.substring(0, valueLengthLimit - 3) + "...";
    }

    serialized[key] = stringValue;
    keysCount++;
  }

  return serialized;
}
