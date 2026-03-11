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
  DeletePaymentMethodInput,
  ListPaymentMethodsOptions,
  PreviewSubscriptionUpdateInput,
  CreateProductInput,
  GetProductInput,
  UpdateProductInput,
  DeleteProductInput,
  ListProductsOptions,
  CreatePriceInput,
  GetPriceInput,
  ListPricesOptions,
  AddInvoiceItemInput,
  CreatePaymentLinkInput,
  GetInvoiceInput,
  ListInvoicesOptions,
  CreateCouponInput,
  GetCouponInput,
  CreateInvoiceInput,
} from "@revstackhq/providers-core";

import * as payments from "@/api/v1/payments";
import * as subscriptions from "@/api/v1/subscriptions";
import * as checkout from "@/api/v1/checkout";
import * as customers from "@/api/v1/customers";
import * as webhooks from "@/api/v1/webhooks";
import * as paymentMethods from "@/api/v1/payment-methods";
import * as catalog from "@/api/v1/catalog";
import * as promotions from "@/api/v1/promotions";
import * as invoices from "@/api/v1/invoices";

export class StripeClientV1 implements ProviderClient {
  // ─── Webhooks ───────────────────────────────────────────────────────────────
  webhooks = {
    validateCredentials: (ctx: ProviderContext) =>
      webhooks.validateCredentials(ctx),

    setup: (ctx: ProviderContext, webhookUrl: string) =>
      webhooks.setupWebhooks(ctx, webhookUrl),

    remove: (ctx: ProviderContext, webhookId: string) =>
      webhooks.removeWebhooks(ctx, webhookId),

    verify: (
      ctx: ProviderContext,
      payload: string | Buffer,
      headers: Record<string, string | string[] | undefined>,
      secret: string,
    ) => webhooks.verifyWebhookSignature(ctx, payload, headers, secret),

    parse: (ctx: ProviderContext, payload: unknown) =>
      webhooks.parseWebhookEvent(ctx, payload),
  };

  // ─── Customers ──────────────────────────────────────────────────────────────
  customers = {
    create: (ctx: ProviderContext, input: CreateCustomerInput) =>
      customers.createCustomer(ctx, input),

    update: (ctx: ProviderContext, input: UpdateCustomerInput) =>
      customers.updateCustomer(ctx, input),

    delete: (ctx: ProviderContext, input: DeleteCustomerInput) =>
      customers.deleteCustomer(ctx, input),

    get: (ctx: ProviderContext, input: GetCustomerInput) =>
      customers.getCustomer(ctx, input),

    list: (ctx: ProviderContext, options: ListCustomersOptions) =>
      customers.listCustomers(ctx, options),
  };

  // ─── Checkout ───────────────────────────────────────────────────────────────
  checkout = {
    createSession: (ctx: ProviderContext, input: CheckoutSessionInput) =>
      checkout.createCheckoutSession(ctx, input),

    createBillingPortal: (ctx: ProviderContext, input: BillingPortalInput) =>
      checkout.createBillingPortalSession(ctx, input),

    createPaymentLink: (ctx: ProviderContext, input: CreatePaymentLinkInput) =>
      checkout.createPaymentLink(ctx, input),
  };

  // ─── Payment Methods ────────────────────────────────────────────────────────
  paymentMethods = {
    setup: (ctx: ProviderContext, input: SetupPaymentMethodInput) =>
      paymentMethods.setupPaymentMethod(ctx, input),

    list: (ctx: ProviderContext, options: ListPaymentMethodsOptions) =>
      paymentMethods.listPaymentMethods(ctx, options),

    delete: (ctx: ProviderContext, input: DeletePaymentMethodInput) =>
      paymentMethods.deletePaymentMethod(ctx, input),
  };

  // ─── Payments ───────────────────────────────────────────────────────────────
  payments = {
    create: (ctx: ProviderContext, input: CreatePaymentInput) =>
      payments.createPayment(ctx, input, checkout.createCheckoutSession),

    get: (ctx: ProviderContext, input: GetPaymentInput) =>
      payments.getPayment(ctx, input),

    refund: (ctx: ProviderContext, input: RefundPaymentInput) =>
      payments.refundPayment(ctx, input),

    list: (ctx: ProviderContext, options: ListPaymentsOptions) =>
      payments.listPayments(ctx, options),

    capture: (ctx: ProviderContext, input: CapturePaymentInput) =>
      payments.capturePayment(ctx, input),
  };

  // ─── Subscriptions ──────────────────────────────────────────────────────────
  subscriptions = {
    create: (ctx: ProviderContext, input: CreateSubscriptionInput) =>
      subscriptions.createSubscription(
        ctx,
        input,
        checkout.createCheckoutSession,
      ),

    get: (ctx: ProviderContext, input: GetSubscriptionInput) =>
      subscriptions.getSubscription(ctx, input),

    cancel: (ctx: ProviderContext, input: CancelSubscriptionInput) =>
      subscriptions.cancelSubscription(ctx, input),

    pause: (ctx: ProviderContext, input: PauseSubscriptionInput) =>
      subscriptions.pauseSubscription(ctx, input),

    resume: (ctx: ProviderContext, input: ResumeSubscriptionInput) =>
      subscriptions.resumeSubscription(ctx, input),

    list: (ctx: ProviderContext, options: ListSubscriptionsOptions) =>
      subscriptions.listSubscriptions(ctx, options),

    update: (ctx: ProviderContext, input: UpdateSubscriptionInput) =>
      subscriptions.updateSubscription(ctx, input),

    preview: (ctx: ProviderContext, input: PreviewSubscriptionUpdateInput) =>
      subscriptions.previewSubscriptionUpdate(ctx, input),
  };

  // ─── Catalog ────────────────────────────────────────────────────────────────
  catalog = {
    createProduct: (ctx: ProviderContext, input: CreateProductInput) =>
      catalog.createProduct(ctx, input),

    getProduct: (ctx: ProviderContext, input: GetProductInput) =>
      catalog.getProduct(ctx, input),

    updateProduct: (ctx: ProviderContext, input: UpdateProductInput) =>
      catalog.updateProduct(ctx, input),

    deleteProduct: (ctx: ProviderContext, input: DeleteProductInput) =>
      catalog.deleteProduct(ctx, input),

    listProducts: (ctx: ProviderContext, options: ListProductsOptions) =>
      catalog.listProducts(ctx, options),

    createPrice: (ctx: ProviderContext, input: CreatePriceInput) =>
      catalog.createPrice(ctx, input),

    getPrice: (ctx: ProviderContext, input: GetPriceInput) =>
      catalog.getPrice(ctx, input),

    listPrices: (ctx: ProviderContext, options: ListPricesOptions) =>
      catalog.listPrices(ctx, options),
  };

  // ─── Invoices ───────────────────────────────────────────────────────────────
  invoices = {
    addItem: (ctx: ProviderContext, input: AddInvoiceItemInput) =>
      invoices.addInvoiceItem(ctx, input),

    create: (ctx: ProviderContext, input: CreateInvoiceInput) =>
      invoices.createInvoice(ctx, input),

    get: (ctx: ProviderContext, input: GetInvoiceInput) =>
      invoices.getInvoice(ctx, input),

    list: (ctx: ProviderContext, options: ListInvoicesOptions) =>
      invoices.listInvoices(ctx, options),
  };

  // ─── Promotions ─────────────────────────────────────────────────────────────
  promotions = {
    createCoupon: (ctx: ProviderContext, input: CreateCouponInput) =>
      promotions.createCoupon(ctx, input),

    getCoupon: (ctx: ProviderContext, input: GetCouponInput) =>
      promotions.getCoupon(ctx, input),
  };
}
