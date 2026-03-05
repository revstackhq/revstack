import { ProviderClient } from "@/api/interface";
import {
  ProviderContext,
  CreatePaymentInput,
  RefundPaymentInput,
  CreateSubscriptionInput,
  UpdateSubscriptionInput,
  CheckoutSessionInput,
  BillingPortalInput,
  SetupPaymentMethodInput,
  CreateCustomerInput,
  UpdateCustomerInput,
  GetPaymentInput,
  ListPaymentsOptions,
  CapturePaymentInput,
  GetSubscriptionInput,
  CancelSubscriptionInput,
  PauseSubscriptionInput,
  ResumeSubscriptionInput,
  ListSubscriptionsOptions,
  GetCustomerInput,
  DeleteCustomerInput,
  ListCustomersOptions,
  ListPaymentMethodsOptions,
  DeletePaymentMethodInput,
} from "@revstackhq/providers-core";

import * as payments from "@/api/v1/payments";
import * as subscriptions from "@/api/v1/subscriptions";
import * as checkout from "@/api/v1/checkout";
import * as customers from "@/api/v1/customers";
import * as webhooks from "@/api/v1/webhooks";
import * as paymentMethods from "@/api/v1/payment-methods";

export class PolarClientV1 implements ProviderClient {
  // ===========================================================================
  // LIFECYCLE & WEBHOOKS
  // ===========================================================================

  validateCredentials(ctx: ProviderContext) {
    return webhooks.validateCredentials(ctx);
  }

  setupWebhooks(ctx: ProviderContext, webhookUrl: string) {
    return webhooks.setupWebhooks(ctx, webhookUrl);
  }

  removeWebhooks(ctx: ProviderContext, webhookId: string) {
    return webhooks.removeWebhooks(ctx, webhookId);
  }

  verifyWebhookSignature(
    ctx: ProviderContext,
    payload: string | Buffer,
    headers: Record<string, string | string[] | undefined>,
    secret: string,
  ) {
    return webhooks.verifyWebhookSignature(ctx, payload, headers, secret);
  }

  parseWebhookEvent(payload: unknown) {
    return webhooks.parseWebhookEvent(payload);
  }

  setupPaymentMethod(ctx: ProviderContext, input: SetupPaymentMethodInput) {
    return paymentMethods.setupPaymentMethod(ctx, input);
  }

  listPaymentMethods(ctx: ProviderContext, options: ListPaymentMethodsOptions) {
    return paymentMethods.listPaymentMethods(ctx, options);
  }

  deletePaymentMethod(ctx: ProviderContext, input: DeletePaymentMethodInput) {
    return paymentMethods.deletePaymentMethod(ctx, input);
  }

  // ===========================================================================
  // PAYMENTS
  // ===========================================================================

  createPayment(ctx: ProviderContext, input: CreatePaymentInput) {
    return payments.createPayment(ctx, input, checkout.createCheckoutSession);
  }

  getPayment(ctx: ProviderContext, input: GetPaymentInput) {
    return payments.getPayment(ctx, input);
  }

  refundPayment(ctx: ProviderContext, input: RefundPaymentInput) {
    return payments.refundPayment(ctx, input);
  }

  listPayments(ctx: ProviderContext, options: ListPaymentsOptions) {
    return payments.listPayments(ctx, options);
  }

  capturePayment(ctx: ProviderContext, input: CapturePaymentInput) {
    return payments.capturePayment(ctx, input);
  }

  // ===========================================================================
  // SUBSCRIPTIONS
  // ===========================================================================

  createSubscription(ctx: ProviderContext, input: CreateSubscriptionInput) {
    return subscriptions.createSubscription(
      ctx,
      input,
      checkout.createCheckoutSession,
    );
  }

  getSubscription(ctx: ProviderContext, input: GetSubscriptionInput) {
    return subscriptions.getSubscription(ctx, input);
  }

  cancelSubscription(ctx: ProviderContext, input: CancelSubscriptionInput) {
    return subscriptions.cancelSubscription(ctx, input);
  }

  pauseSubscription(ctx: ProviderContext, input: PauseSubscriptionInput) {
    return subscriptions.pauseSubscription(ctx, input);
  }

  resumeSubscription(ctx: ProviderContext, input: ResumeSubscriptionInput) {
    return subscriptions.resumeSubscription(ctx, input);
  }

  listSubscriptions(ctx: ProviderContext, options: ListSubscriptionsOptions) {
    return subscriptions.listSubscriptions(ctx, options);
  }

  updateSubscription(ctx: ProviderContext, input: UpdateSubscriptionInput) {
    return subscriptions.updateSubscription(ctx, input);
  }

  // ===========================================================================
  // CHECKOUT
  // ===========================================================================

  createCheckoutSession(ctx: ProviderContext, input: CheckoutSessionInput) {
    return checkout.createCheckoutSession(ctx, input);
  }

  createBillingPortalSession(ctx: ProviderContext, input: BillingPortalInput) {
    return checkout.createBillingPortalSession(ctx, input);
  }

  // ===========================================================================
  // CUSTOMERS
  // ===========================================================================

  createCustomer(ctx: ProviderContext, input: CreateCustomerInput) {
    return customers.createCustomer(ctx, input);
  }

  updateCustomer(ctx: ProviderContext, input: UpdateCustomerInput) {
    return customers.updateCustomer(ctx, input);
  }

  deleteCustomer(ctx: ProviderContext, input: DeleteCustomerInput) {
    return customers.deleteCustomer(ctx, input);
  }

  getCustomer(ctx: ProviderContext, input: GetCustomerInput) {
    return customers.getCustomer(ctx, input);
  }

  listCustomers(ctx: ProviderContext, options: ListCustomersOptions) {
    return customers.listCustomers(ctx, options);
  }
}
