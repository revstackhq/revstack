import { PaginationOptions } from "@/types/shared";

export type SetupPaymentMethodInput = {
  /** revstack customer id. */
  customerId: string;
  /** redirect return url */
  returnUrl: string;
  /** redirect cancel url */
  cancelUrl: string;
  /** custom metadata */
  metadata?: Record<string, any>;

  /** currency */
  currency?: string;
};

export type DeletePaymentMethodInput = { id: string };

export interface ListPaymentMethodsOptions extends PaginationOptions {
  customerId: string;
}
