import { Payment } from "@/types/payments/model";
import { Refund } from "@/types/refunds/model";
import { Dispute } from "@/types/disputes/model";
import { CheckoutSession } from "@/types/checkout/model";
import { Subscription } from "@/types/subscriptions/model";
import { Invoice } from "@/types/invoices/model";
import { Customer } from "@/types/customers/model";
import { PaymentMethod, Mandate } from "@/types/payment-methods/model";
import { Product, Price } from "@/types/catalog/model";

/**
 * Standardized contract for mapping provider-specific payment objects
 * into the unified Revstack Payment entity.
 */
export type PaymentMapper = (rawObject: any) => Payment;

/**
 * Standardized contract for mapping provider-specific refund objects
 * into the unified Revstack Refund entity.
 */
export type RefundMapper = (rawObject: any) => Refund;

/**
 * Standardized contract for mapping provider-specific dispute/chargeback objects
 * into the unified Revstack Dispute entity.
 */
export type DisputeMapper = (rawObject: any) => Dispute;

/**
 * Standardized contract for mapping provider-specific checkout sessions
 * into the unified Revstack CheckoutSession entity.
 */
export type CheckoutSessionMapper = (rawObject: any) => CheckoutSession;

/**
 * Standardized contract for mapping provider-specific subscription objects
 * into the unified Revstack Subscription entity.
 */
export type SubscriptionMapper = (rawObject: any) => Subscription;

/**
 * Standardized contract for mapping provider-specific billing documents
 * into the unified Revstack Invoice entity.
 */
export type InvoiceMapper = (rawObject: any) => Invoice;

/**
 * Standardized contract for mapping provider-specific customer records
 * into the unified Revstack Customer entity.
 */
export type CustomerMapper = (rawObject: any) => Customer;

/**
 * Standardized contract for mapping provider-specific payment instruments
 * into the discriminated Revstack PaymentMethod entity.
 * * @param rawObject - The raw payment method object.
 * @param defaultId - Optional identifier to flag this instrument as the default.
 */
export type PaymentMethodMapper = (
  rawObject: any,
  defaultId?: string | null,
) => PaymentMethod;

/**
 * Standardized contract for mapping provider-specific bank authorizations
 * into the unified Revstack Mandate entity.
 */
export type MandateMapper = (rawObject: any) => Mandate;

/**
 * Standardized contract for mapping provider-specific catalog items
 * into the unified Revstack Product entity.
 */
export type ProductMapper = (rawObject: any) => Product;

/**
 * Standardized contract for mapping provider-specific pricing tiers/rules
 * into the unified Revstack Price entity.
 */
export type PriceMapper = (rawObject: any) => Price;
