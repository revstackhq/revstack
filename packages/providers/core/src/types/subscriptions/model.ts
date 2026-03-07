/**
 * Standardized lifecycle states for a Revstack Subscription.
 * These states abstract away provider-specific quirks to give the merchant
 * a unified, predictable, and strictly typed billing state machine.
 */
export enum SubscriptionStatus {
  // ─── Setup Phase ────────────────────────────────────────────────────────────

  /** * Created but awaiting first successful payment, confirmation, or SCA authentication.
   * The user should NOT have access to the service yet.
   */
  Incomplete = "incomplete",

  /** * The incomplete subscription expired (typically after 23 hours) before the user
   * completed the payment flow. Safely ignored or garbage-collected.
   */
  IncompleteExpired = "incomplete_expired",

  // ─── Active Phase (Service is granted) ──────────────────────────────────────

  /** * The subscription is active and currently in a free trial period.
   * No successful payment has been made yet, but access is granted.
   */
  Trialing = "trialing",

  /** * The subscription is active, fully paid, and in good standing.
   * NOTE: If a user intends to cancel at the end of the month, the status REMAINS "Active",
   * but the subscription's `cancelAtPeriodEnd` flag becomes true.
   */
  Active = "active",

  // ─── Warning Phase (Service access depends on Merchant's grace period) ──────

  /** * A recurring payment has failed. The provider is currently retrying the charge
   * based on the Dunning process. The user typically retains access during this grace period.
   */
  PastDue = "past_due",

  /** * The subscription contract exists, but billing collection has been temporarily halted.
   * Service access during this state is at the merchant's discretion.
   */
  Paused = "paused",

  // ─── Terminal Phase (Service must be cut off) ───────────────────────────────

  /** * All automatic payment retries have been exhausted without success.
   * The subscription is effectively frozen/suspended. Access MUST be cut off.
   */
  Unpaid = "unpaid",

  /** * The final, permanent terminal state (Replaces the ambiguous "canceled" status).
   * The subscription is completely dead, either because the billing period ended
   * after a cancellation request, or an admin terminated it immediately.
   * Access MUST be revoked.
   */
  Revoked = "revoked",
}

// ─── New Architecture: Line Items ─────────────────────────────────────────────

/**
 * Represents a single product or add-on attached to a subscription.
 * A subscription can have multiple items (e.g., Base Plan + Extra Seats + Premium Support).
 */
export interface SubscriptionItem {
  /** The provider's unique identifier for this specific line item record. */
  externalId: string;
  /** The provider's internal ID for the pricing tier (e.g., "price_123xyz"). */
  priceId: string;
  /** The provider's internal ID for the parent product (e.g., "prod_123xyz"). */
  productId: string;
  /** The quantity of this item purchased (defaults to 1 for flat-rate plans). */
  quantity: number;
  /** Key-value store for custom data attached specifically to this line item. */
  metadata?: Record<string, any>;
}

// ─── Core Entity ──────────────────────────────────────────────────────────────

/**
 * The agnostic Revstack Subscription entity.
 * This represents the normalized data structure that will be persisted in your database.
 */
export interface Subscription {
  /** Revstack internal DB ID for this subscription. */
  id: string;
  /** The raw ID assigned by the payment provider (e.g., "sub_123xyz"). */
  externalId: string;
  /** The slug of the provider managing this subscription (e.g., "stripe", "polar"). */
  providerId: string;
  /** The internal Revstack Customer ID (mapped from the provider's customer ID). */
  customerId: string;

  /** The unified lifecycle state of the subscription. */
  status: SubscriptionStatus;

  /** * The total recurring amount in the smallest currency unit (e.g., cents).
   * This aggregates all line items if the subscription has multiple components.
   */
  amount: number;
  /** The ISO 4217 currency code normalized to uppercase (e.g., "USD"). */
  currency: string;

  /** * The list of products/prices attached to this subscription.
   * Architecturally replaces a flat root `priceId` to support multi-product carts.
   */
  items: SubscriptionItem[];

  /** Native Date indicating when the current billing cycle started. */
  currentPeriodStart: Date;
  /** Native Date indicating when the current billing cycle ends. */
  currentPeriodEnd: Date;
  /** Flag indicating if the subscription is scheduled to cancel at the end of the current period. */
  cancelAtPeriodEnd: boolean;

  /** Native Date indicating exactly when the subscription was originally created/started. */
  startedAt: Date;
  /** Native Date indicating exactly when the subscription was canceled (if applicable). */
  canceledAt?: Date;
  /** Native Date indicating when the subscription permanently ended. */
  endedAt?: Date;
  /** Native Date indicating when the trial period started (if applicable). */
  trialStart?: Date;
  /** Native Date indicating when the trial period ends (if applicable). */
  trialEnd?: Date;
  /** Native Date indicating when a paused subscription will automatically resume billing. */
  pauseResumesAt?: Date;

  /** Key-value store for custom data attached to the subscription root. */
  metadata?: Record<string, any>;
  /** The unmodified webhook/API payload from the provider, useful for debugging or auditing. */
  raw?: any;
}
