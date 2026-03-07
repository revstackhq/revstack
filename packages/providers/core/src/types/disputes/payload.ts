import { DisputeStatus } from "@/types/disputes/model";

/**
 * Payload for chargeback and dispute events initiated by the customer's bank.
 */
export interface DisputePayload {
  /** The ID of the original payment being disputed. */
  paymentId: string;
  /** The disputed amount withheld by the banking network (in the smallest currency unit). */
  amount: number;
  /** Three-letter ISO currency code, in lowercase. */
  currency: string;
  /** The dispute reason code provided by the bank. */
  reason: string;
  /** The current stage of the dispute lifecycle. */
  status: DisputeStatus;
}
