import { customAlphabet } from "nanoid";

/**
 * Custom nanoid alphabet omitting confusing characters.
 * Ensures clean, URL-safe identifiers throughout the system.
 */
const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  12,
);

/**
 * Generates an elegant, Stripe-like uniquely identifiable string.
 *
 * @param prefix - The prefix indicating the entity type (e.g., 'usr', 'sub', 'wal').
 * @returns A unique identifier string in the format `${prefix}_${nanoid}`.
 */
export const generateId = (prefix: string) => `${prefix}_${nanoid()}`;
