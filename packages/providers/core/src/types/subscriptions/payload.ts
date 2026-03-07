import { SubscriptionStatus } from "@/types/subscriptions/model";

/**
 * Payload representing the current billing state of a recurring subscription.
 * The shape mirrors a subset of the full `Subscription` model, focused on
 * the data needed to update the state machine in response to a webhook event.
 */
export interface SubscriptionPayload {
  /** The current lifecycle state of the subscription (e.g., active, past_due, revoked). */
  status: SubscriptionStatus;

  /** The start timestamp of the current billing cycle. */
  currentPeriodStart: Date;

  /** The end timestamp of the current billing cycle. */
  currentPeriodEnd: Date;

  /** Whether the subscription is scheduled to automatically cancel at the end of the current period. */
  cancelAtPeriodEnd: boolean;

  /** The expected total amount for the next renewal (useful for usage-based or metered plans). */
  expectedAmountTotal?: number;

  /** Default tax rate IDs attached to the subscription. */
  defaultTaxRateIds?: string[];
}
