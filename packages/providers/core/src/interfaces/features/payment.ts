import { ProviderContext } from "@/context";
import {
  CreatePaymentInput,
  Payment,
  RefundPaymentInput,
  GetPaymentInput,
  ListPaymentsOptions,
  CapturePaymentInput,
} from "@/types/payments";
import { AsyncActionResult, PaginatedResult } from "@/types/shared";

/**
 * Interface for One-Time Payment operations.
 * Handles the lifecycle of a single transaction (Auth, Capture, Refund).
 */
export interface IPaymentFeature {
  /**
   * Initiates a one-time payment transaction.
   *
   * Depending on the provider and configuration, this may return:
   * - `success`: Payment was authorized or captured immediately.
   * - `requires_action`: The user must be redirected (3DS, Bank Redirect, Hosted Checkout).
   * - `pending`: The payment is processing asynchronously (e.g., Boleto, Wire).
   *
   * @param ctx - The execution context containing decrypted credentials and trace IDs.
   * @param input - The payment details (amount, currency, customer, method).
   * @returns The entity ID wrapped in an AsyncActionResult.
   */
  createPayment(
    ctx: ProviderContext,
    input: CreatePaymentInput,
  ): Promise<AsyncActionResult<string>>;

  /**
   * Retrieves the current status and details of a specific payment.
   * Useful for polling status updates or displaying transaction history.
   *
   * @param ctx - The execution context.
   * @param id - The Provider's external ID (e.g., `pi_123...`).
   */
  getPayment(
    ctx: ProviderContext,
    input: GetPaymentInput,
  ): Promise<AsyncActionResult<Payment>>;

  /**
   * Refunds a payment, either partially or in full.
   *
   * @param ctx - The execution context.
   * @param input - Contains the payment ID, amount to refund, and reason.
   */
  refundPayment(
    ctx: ProviderContext,
    input: RefundPaymentInput,
  ): Promise<AsyncActionResult<string>>;

  /**
   * Lists historical payments with pagination support.
   *
   * @param ctx - The execution context.
   * @param pagination - Options for limit and cursor-based navigation.
   */
  listPayments?(
    ctx: ProviderContext,
    options: ListPaymentsOptions,
  ): Promise<AsyncActionResult<PaginatedResult<Payment>>>;

  /**
   * Captures a previously authorized payment.
   * Only applicable when `capture: true` is set in capabilities.
   *
   * @param ctx - The execution context.
   * @param id - The Payment ID to capture.
   * @param amount - Optional amount to capture (partial capture).
   */
  capturePayment?(
    ctx: ProviderContext,
    input: CapturePaymentInput,
  ): Promise<AsyncActionResult<string>>;
}
