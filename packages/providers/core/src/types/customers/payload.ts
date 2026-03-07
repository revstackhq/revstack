/**
 * Payload for customer lifecycle events.
 * Mirrors the relevant fields from the Customer model for event context.
 */
export interface CustomerPayload {
  /** The customer's email address. */
  email?: string;
  /** The customer's full name or business entity name. */
  name?: string;
  /** The customer's phone number. */
  phone?: string;
  /** Whether the provider considers this customer delinquent due to unpaid invoices. */
  delinquent?: boolean;
}
