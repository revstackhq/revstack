import { ProviderContext } from "@/context";
import { AsyncActionResult } from "@/types/shared";

// ─── Aggregation Strategy ─────────────────────────────────────────────────────

/**
 * Defines how the provider should roll up individual usage events into a
 * single reportable value for a billing period.
 *
 * @remarks
 * Not all providers support all aggregation types. The orchestrator will
 * validate the requested type against the provider's capabilities at
 * meter creation time.
 */
export type MeterAggregationType =
  /**
   * Sum all event values within the period.
   *
   * @example 3 events of value 10 → total = 30
   */
  | "sum"
  /**
   * Count the number of events, ignoring the value field.
   *
   * @example 3 events → total = 3
   */
  | "count"
  /**
   * Take the maximum event value within the period.
   *
   * @example Events with values [5, 20, 8] → total = 20
   */
  | "max"
  /**
   * Take the last (most recent) event value within the period.
   * Useful for gauge-style metrics like "current seat count".
   *
   * @example Events with values [5, 20, 8] → total = 8
   */
  | "last";

// ─── CreateMeterInput ─────────────────────────────────────────────────────────

/**
 * Input for registering a usage metric (Meter) with a provider.
 *
 * Some providers (e.g., Stripe) require an explicit meter definition before
 * usage events can be streamed. This step binds a logical event name to an
 * aggregation strategy on the provider side.
 *
 * @remarks
 * This input is only relevant when the provider's capability flag
 * `billing.features.requiresMeterCreation` is `true`.
 *
 * @example
 * ```ts
 * // Register an "api_calls" meter that sums all incoming events
 * await client.billing.createMeter({
 *   eventName: "api_calls",
 *   displayName: "API Call Volume",
 *   aggregationType: "sum",
 * });
 * ```
 */
export type CreateMeterInput = {
  /**
   * The unique identifier for this event stream.
   *
   * This key is used when ingesting events via `ingestEvent` and must match
   * the provider's meter/metric identifier exactly. Convention is `snake_case`.
   *
   * @example "api_calls", "storage_gb", "active_seats"
   */
  eventName: string;

  /**
   * A human-readable label for dashboards and invoices.
   *
   * If omitted, most providers will derive the display name from `eventName`.
   */
  displayName?: string;

  /**
   * How the provider should roll up individual events into a single value
   * at the end of each billing period.
   *
   * @see {@link MeterAggregationType} for the full list of strategies.
   */
  aggregationType: MeterAggregationType;
};

// ─── IngestEventInput ─────────────────────────────────────────────────────────

/**
 * Input for streaming a single raw usage data point to the provider's
 * metering API (e.g., Stripe `billing.meterEvents.create`).
 *
 * @remarks
 * - The `eventName` **must** match a previously registered meter when
 *   `billing.features.requiresMeterCreation` is `true`.
 * - The provider is responsible for aggregation, rating, and invoice
 *   attachment when the strategy is `"native_events"`.
 *
 * @example
 * ```ts
 * // Report 50 API calls for a customer
 * await client.billing.ingestEvent({
 *   customerId: "cus_abc123",
 *   eventName: "api_calls",
 *   value: 50,
 *   idempotencyKey: "evt_20240315_abc123_batch42",
 * });
 * ```
 */
export type IngestEventInput = {
  /**
   * The provider-side customer ID that this usage event belongs to.
   *
   * Must be a valid, existing customer ID on the provider. The orchestrator
   * resolves the Revstack customer to the provider customer before calling.
   */
  customerId: string;

  /**
   * The event stream identifier. Must match a registered meter's `eventName`
   * (or a provider-recognized metric key).
   *
   * @example "api_calls", "compute_seconds"
   */
  eventName: string;

  /**
   * The usage amount for this data point.
   *
   * Interpretation depends on the meter's `aggregationType`:
   * - `"sum"` → this value is added to the running total.
   * - `"count"` → this value is typically `1` (the count increments by 1).
   * - `"max"` → compared against the current max.
   * - `"last"` → replaces the current gauge value.
   *
   * @example 1, 50, 1024
   */
  value: number;

  /**
   * When the usage event occurred.
   *
   * Defaults to the current timestamp if omitted. Providers may reject
   * events with timestamps too far in the past (e.g., Stripe rejects
   * events older than 3 hours for realtime meters).
   */
  timestamp?: Date;

  /**
   * A unique key to prevent double-counting this event.
   *
   * If the provider receives two events with the same idempotency key,
   * only the first is processed. Strongly recommended for at-least-once
   * delivery pipelines.
   *
   * @example "evt_20240315_cus_abc123_batch42"
   */
  idempotencyKey?: string;
};
