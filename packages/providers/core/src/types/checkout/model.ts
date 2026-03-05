export type CheckoutSessionMode = "payment" | "subscription" | "setup";
export type CheckoutSessionBillingAddressCollection = "auto" | "required";

export type CheckoutSessionResult = {
  /** external checkout session id */
  id: string;
  /** expires at iso */
  expiresAt?: string;
};
