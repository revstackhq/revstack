import { ProviderContext } from "@/context";
import { CheckoutSessionResult } from "@/types/checkout";
import {
  SetupPaymentMethodInput,
  PaymentMethod,
  ListPaymentMethodsOptions,
  DeletePaymentMethodInput,
} from "@/types/paymentMethods";
import { AsyncActionResult } from "@/types/shared";

/**
 * Interface for managing saved Payment Instruments (Vaulting).
 */
export interface IPaymentMethodFeature {
  /**
   * Creates a setup-mode checkout session to save a payment method.
   */
  setupPaymentMethod?(
    ctx: ProviderContext,
    input: SetupPaymentMethodInput,
  ): Promise<AsyncActionResult<CheckoutSessionResult>>;

  /**
   * Lists all valid payment methods (cards, bank accounts) attached to a customer.
   * Useful for "My Wallet" or "Change Payment Method" screens.
   *
   * @param ctx - The execution context.
   * @param customerId - The Provider's Customer ID.
   */
  listPaymentMethods(
    ctx: ProviderContext,
    options: ListPaymentMethodsOptions,
  ): Promise<AsyncActionResult<PaymentMethod[]>>;

  /**
   * Detaches or deletes a payment method from a customer.
   * Prevents future charges on that instrument.
   *
   * @param ctx - The execution context.
   * @param id - The Payment Method ID (e.g., `pm_123`).
   */
  deletePaymentMethod(
    ctx: ProviderContext,
    input: DeletePaymentMethodInput,
  ): Promise<AsyncActionResult<boolean>>;
}
