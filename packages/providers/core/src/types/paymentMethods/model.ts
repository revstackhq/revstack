import { PaymentMethodDetails } from "@/types/payments";

export type PaymentMethodType =
  | "card"
  | "bank_transfer"
  | "wallet"
  | "crypto"
  | "pix"
  | "apple_pay"
  | "google_pay"
  | "cash"
  | "amazon_pay";

export type PaymentMethod = {
  /** revstack payment method id */
  id: string;
  /** revstack customer id. */
  customerId: string;
  /** external payment method id. */
  externalId: string;
  /** payment method type */
  type: "card" | "bank_transfer" | "wallet";
  /** Detailed payment method metadata. */
  details: PaymentMethodDetails;
  /** is default flag */
  isDefault: boolean;
  /** custom metadata */
  metadata?: Record<string, any>;
};
