import { getClient } from "@/api/factory";
import { manifest } from "@/manifest";
import {
  AsyncActionResult,
  BaseProvider,
  BillingPortalInput,
  BillingPortalResult,
  CheckoutSessionInput,
  CheckoutSessionResult,
  CreateCustomerInput,
  CreatePaymentInput,
  CreateSubscriptionInput,
  UpdateSubscriptionInput,
  SetupPaymentMethodInput,
  Customer,
  InstallInput,
  InstallResult,
  PaginatedResult,
  Payment,
  PaymentMethod,
  ProviderContext,
  RefundPaymentInput,
  RevstackErrorCode,
  RevstackEvent,
  Subscription,
  UninstallInput,
  UpdateCustomerInput,
  WebhookResponse,
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
  Product,
  CreateProductInput,
  GetProductInput,
  UpdateProductInput,
  DeleteProductInput,
  ListProductsOptions,
  Price,
  CreatePriceInput,
  GetPriceInput,
  ListPricesOptions,
  AddInvoiceItemInput,
  CreatePaymentLinkInput,
  Invoice,
  GetInvoiceInput,
  ListInvoicesOptions,
  Coupon,
  CreateCouponInput,
  GetCouponInput,
  PreviewSubscriptionUpdateInput,
  ProrationPreviewResult,
  CreateInvoiceInput,
} from "@revstackhq/providers-core";

export class StripeProvider extends BaseProvider {
  static manifest = manifest;
  manifest = manifest;

  // ===========================================================================
  // CORE & WEBHOOKS
  // ===========================================================================

  async onInstall(
    ctx: ProviderContext,
    input: InstallInput,
  ): Promise<AsyncActionResult<InstallResult>> {
    const client = getClient(input.config);
    const installVersion = manifest.version;

    const isValid = await client.webhooks.validateCredentials({
      ...ctx,
      config: input.config,
    });

    if (!isValid) {
      return {
        data: { success: false },
        status: "failed",
        error: {
          code: RevstackErrorCode.InvalidCredentials,
          message:
            "Failed to connect to provider. Please check your API Key / Secrets.",
        },
      };
    }

    let webhookData: Record<string, any> = {};

    if (client.webhooks.setup && input.webhookUrl) {
      try {
        const wh = await client.webhooks.setup(
          { ...ctx, config: input.config },
          input.webhookUrl,
        );

        const whData = wh.data as InstallResult;

        if (!wh.data || !whData.success) {
          return {
            data: { success: false },
            status: "failed",
            error: {
              code: RevstackErrorCode.UnknownError,
              message: "Failed to setup webhooks in Stripe",
            },
          };
        }

        webhookData = {
          webhookEndpointId: whData.data?.webhookEndpointId,
          webhookSecret: whData.data?.webhookSecret,
        };
      } catch (error: any) {
        console.warn("Webhook setup failed (non-fatal):", error.message);
        return {
          data: { success: false },
          status: "failed",
          error: {
            code: RevstackErrorCode.MisconfiguredProvider,
            message: `Webhook setup failed: ${error.message}`,
          },
        };
      }
    }

    return {
      data: {
        success: true,
        data: {
          ...input.config,
          ...webhookData,
          _providerVersion: installVersion,
        },
      },
      status: "success",
    };
  }

  async onUninstall(
    ctx: ProviderContext,
    input: UninstallInput,
  ): Promise<AsyncActionResult<boolean>> {
    const client = getClient(input.config);

    if (client.webhooks.remove && input.data.webhookEndpointId) {
      try {
        await client.webhooks.remove(
          ctx,
          input.data.webhookEndpointId as string,
        );
      } catch (e) {
        console.warn("Failed to remove webhook on uninstall:", e);
      }
    }
    return {
      data: true,
      status: "success",
    };
  }

  async verifyWebhookSignature(
    ctx: ProviderContext,
    payload: string | Buffer,
    headers: Record<string, string | string[] | undefined>,
    secret: string,
  ): Promise<AsyncActionResult<boolean>> {
    const client = getClient(ctx.config);
    return client.webhooks.verify(ctx, payload, headers, secret);
  }

  async parseWebhookEvent(
    ctx: ProviderContext,
    payload: any,
  ): Promise<AsyncActionResult<RevstackEvent | null>> {
    const client = getClient(ctx.config);
    return client.webhooks.parse(ctx, payload);
  }

  async getWebhookResponse(): Promise<AsyncActionResult<WebhookResponse>> {
    return {
      data: { statusCode: 200, body: { received: true } },
      status: "success",
    };
  }

  // ===========================================================================
  // PAYMENTS
  // ===========================================================================

  async createPayment(
    ctx: ProviderContext,
    input: CreatePaymentInput,
  ): Promise<AsyncActionResult<string>> {
    const client = getClient(ctx.config);

    if (!client.payments.create) {
      return {
        data: null,
        status: "failed",
        error: {
          code: RevstackErrorCode.NotImplemented,
          message: `Provider '${this.manifest.slug}' does not support createPayment.`,
        },
      };
    }

    return client.payments.create(ctx, input);
  }

  async getPayment(
    ctx: ProviderContext,
    input: GetPaymentInput,
  ): Promise<AsyncActionResult<Payment>> {
    const client = getClient(ctx.config);

    if (!client.payments.get) {
      return {
        data: null,
        status: "failed",
        error: {
          code: RevstackErrorCode.NotImplemented,
          message: "Get payment not supported",
        },
      };
    }

    return client.payments.get(ctx, input);
  }

  async refundPayment(
    ctx: ProviderContext,
    input: RefundPaymentInput,
  ): Promise<AsyncActionResult<string>> {
    const client = getClient(ctx.config);

    if (!client.payments.refund) {
      return {
        data: null,
        status: "failed",
        error: {
          code: RevstackErrorCode.NotImplemented,
          message: "Refunds not supported by this provider version",
        },
      };
    }

    return client.payments.refund(ctx, input);
  }

  async listPayments(
    ctx: ProviderContext,
    options: ListPaymentsOptions,
  ): Promise<AsyncActionResult<PaginatedResult<Payment>>> {
    const client = getClient(ctx.config);

    if (!client.payments.list) {
      return {
        data: null,
        status: "failed",
        error: {
          code: RevstackErrorCode.NotImplemented,
          message: "List payments not supported",
        },
      };
    }

    return client.payments.list(ctx, options);
  }

  async capturePayment(
    ctx: ProviderContext,
    input: CapturePaymentInput,
  ): Promise<AsyncActionResult<string>> {
    const client = getClient(ctx.config);

    if (!client.payments.capture) {
      return {
        data: null,
        status: "failed",
        error: {
          code: RevstackErrorCode.NotImplemented,
          message: "Capture not supported",
        },
      };
    }

    return client.payments.capture(ctx, input);
  }

  // ===========================================================================
  // SUBSCRIPTIONS
  // ===========================================================================

  async createSubscription(
    ctx: ProviderContext,
    input: CreateSubscriptionInput,
  ): Promise<AsyncActionResult<string>> {
    const client = getClient(ctx.config);

    if (!client.subscriptions.create) {
      return {
        data: null,
        status: "failed",
        error: {
          code: RevstackErrorCode.NotImplemented,
          message: "Subscriptions not supported",
        },
      };
    }

    return client.subscriptions.create(ctx, input);
  }

  async getSubscription(
    ctx: ProviderContext,
    input: GetSubscriptionInput,
  ): Promise<AsyncActionResult<Subscription>> {
    const client = getClient(ctx.config);

    if (!client.subscriptions.get) {
      return {
        data: null,
        status: "failed",
        error: {
          code: RevstackErrorCode.NotImplemented,
          message: "Get subscription not supported",
        },
      };
    }

    return client.subscriptions.get(ctx, input);
  }

  async cancelSubscription(
    ctx: ProviderContext,
    input: CancelSubscriptionInput,
  ): Promise<AsyncActionResult<string>> {
    const client = getClient(ctx.config);

    if (!client.subscriptions.cancel) {
      return {
        data: null,
        status: "failed",
        error: {
          code: RevstackErrorCode.NotImplemented,
          message: "Cancel subscription not supported",
        },
      };
    }

    return client.subscriptions.cancel(ctx, input);
  }

  async pauseSubscription(
    ctx: ProviderContext,
    input: PauseSubscriptionInput,
  ): Promise<AsyncActionResult<string>> {
    const client = getClient(ctx.config);

    if (!client.subscriptions.pause) {
      return {
        data: null,
        status: "failed",
        error: {
          code: RevstackErrorCode.NotImplemented,
          message: "Pause subscription not supported",
        },
      };
    }

    return client.subscriptions.pause(ctx, input);
  }

  async resumeSubscription(
    ctx: ProviderContext,
    input: ResumeSubscriptionInput,
  ): Promise<AsyncActionResult<string>> {
    const client = getClient(ctx.config);

    if (!client.subscriptions.resume) {
      return {
        data: null,
        status: "failed",
        error: {
          code: RevstackErrorCode.NotImplemented,
          message: "Resume subscription not supported",
        },
      };
    }

    return client.subscriptions.resume(ctx, input);
  }

  async listSubscriptions(
    ctx: ProviderContext,
    options: ListSubscriptionsOptions,
  ): Promise<AsyncActionResult<PaginatedResult<Subscription>>> {
    const client = getClient(ctx.config);

    if (!client.subscriptions.list) {
      return {
        data: null,
        status: "failed",
        error: {
          code: RevstackErrorCode.NotImplemented,
          message: "List subscriptions not supported",
        },
      };
    }

    return client.subscriptions.list(ctx, options);
  }

  async updateSubscription(
    ctx: ProviderContext,
    input: UpdateSubscriptionInput,
  ): Promise<AsyncActionResult<string>> {
    const client = getClient(ctx.config);

    if (!client.subscriptions.update) {
      return {
        data: null,
        status: "failed",
        error: {
          code: RevstackErrorCode.NotImplemented,
          message: "Update subscription not supported",
        },
      };
    }

    return client.subscriptions.update(ctx, input);
  }

  async previewSubscriptionUpdate(
    ctx: ProviderContext,
    input: PreviewSubscriptionUpdateInput,
  ): Promise<AsyncActionResult<ProrationPreviewResult>> {
    const client = getClient(ctx.config);

    if (!client.subscriptions.preview) {
      return {
        data: null,
        status: "failed",
        error: {
          code: RevstackErrorCode.NotImplemented,
          message: "Preview subscription update not supported",
        },
      };
    }

    return client.subscriptions.preview(ctx, input);
  }

  // ===========================================================================
  // CHECKOUT & PORTAL
  // ===========================================================================

  async createCheckoutSession(
    ctx: ProviderContext,
    input: CheckoutSessionInput,
  ): Promise<AsyncActionResult<CheckoutSessionResult>> {
    const client = getClient(ctx.config);

    if (!client.checkout.createSession) {
      return {
        data: null,
        status: "failed",
        error: {
          code: RevstackErrorCode.NotImplemented,
          message: "Checkout not supported",
        },
      };
    }

    return client.checkout.createSession(ctx, input);
  }

  async createBillingPortalSession(
    ctx: ProviderContext,
    input: BillingPortalInput,
  ): Promise<AsyncActionResult<BillingPortalResult>> {
    const client = getClient(ctx.config);

    if (!client.checkout.createBillingPortal) {
      return {
        data: null,
        status: "failed",
        error: {
          code: RevstackErrorCode.NotImplemented,
          message: "Billing portal not supported",
        },
      };
    }

    return client.checkout.createBillingPortal(ctx, input);
  }

  async createPaymentLink(
    ctx: ProviderContext,
    input: CreatePaymentLinkInput,
  ): Promise<AsyncActionResult<string>> {
    const client = getClient(ctx.config);

    if (!client.checkout.createPaymentLink) {
      return {
        data: null,
        status: "failed",
        error: {
          code: RevstackErrorCode.NotImplemented,
          message: "Payment links not supported by this provider.",
        },
      };
    }

    return client.checkout.createPaymentLink(ctx, input);
  }

  async setupPaymentMethod(
    ctx: ProviderContext,
    input: SetupPaymentMethodInput,
  ): Promise<AsyncActionResult<CheckoutSessionResult>> {
    const client = getClient(ctx.config);

    if (!client.paymentMethods.setup) {
      return {
        data: null,
        status: "failed",
        error: {
          code: RevstackErrorCode.NotImplemented,
          message: "Setup payment method not supported",
        },
      };
    }

    return client.paymentMethods.setup(ctx, input);
  }

  // ===========================================================================
  // CUSTOMERS
  // ===========================================================================

  async createCustomer(
    ctx: ProviderContext,
    input: CreateCustomerInput,
  ): Promise<AsyncActionResult<string>> {
    const client = getClient(ctx.config);

    if (!client.customers.create) {
      return {
        data: null,
        status: "failed",
        error: {
          code: RevstackErrorCode.NotImplemented,
          message: "Customer creation not supported",
        },
      };
    }

    return client.customers.create(ctx, input);
  }

  async updateCustomer(
    ctx: ProviderContext,
    input: UpdateCustomerInput,
  ): Promise<AsyncActionResult<string>> {
    const client = getClient(ctx.config);

    if (!client.customers.update) {
      return {
        data: null,
        status: "failed",
        error: {
          code: RevstackErrorCode.NotImplemented,
          message: "Customer update not supported",
        },
      };
    }

    return client.customers.update(ctx, input);
  }

  async deleteCustomer(
    ctx: ProviderContext,
    input: DeleteCustomerInput,
  ): Promise<AsyncActionResult<boolean>> {
    const client = getClient(ctx.config);

    if (!client.customers.delete) {
      return {
        data: false,
        status: "failed",
        error: {
          code: RevstackErrorCode.NotImplemented,
          message: "Customer deletion not supported",
        },
      };
    }

    return client.customers.delete(ctx, input);
  }

  async getCustomer(
    ctx: ProviderContext,
    input: GetCustomerInput,
  ): Promise<AsyncActionResult<Customer>> {
    const client = getClient(ctx.config);

    if (!client.customers.get) {
      return {
        data: null,
        status: "failed",
        error: {
          code: RevstackErrorCode.NotImplemented,
          message: "Get customer not supported",
        },
      };
    }

    return client.customers.get(ctx, input);
  }

  async listCustomers(
    ctx: ProviderContext,
    options: ListCustomersOptions,
  ): Promise<AsyncActionResult<PaginatedResult<Customer>>> {
    const client = getClient(ctx.config);

    if (!client.customers.list) {
      return {
        data: null,
        status: "failed",
        error: {
          code: RevstackErrorCode.NotImplemented,
          message: "List customers not supported",
        },
      };
    }

    return client.customers.list(ctx, options);
  }

  // ===========================================================================
  // PAYMENT METHODS
  // ===========================================================================

  async listPaymentMethods(
    ctx: ProviderContext,
    options: ListPaymentMethodsOptions,
  ): Promise<AsyncActionResult<PaymentMethod[]>> {
    const client = getClient(ctx.config);

    if (!client.paymentMethods.list) {
      return {
        data: null,
        status: "failed",
        error: {
          code: RevstackErrorCode.NotImplemented,
          message: "List payment methods not supported",
        },
      };
    }

    return client.paymentMethods.list(ctx, options);
  }

  async deletePaymentMethod(
    ctx: ProviderContext,
    input: DeletePaymentMethodInput,
  ): Promise<AsyncActionResult<boolean>> {
    const client = getClient(ctx.config);

    if (!client.paymentMethods.delete) {
      return {
        data: false,
        status: "failed",
        error: {
          code: RevstackErrorCode.NotImplemented,
          message: "Delete payment method not supported",
        },
      };
    }

    return client.paymentMethods.delete(ctx, input);
  }

  // ===========================================================================
  // CATALOG (PRODUCTS & PRICES)
  // ===========================================================================

  async createProduct(
    ctx: ProviderContext,
    input: CreateProductInput,
  ): Promise<AsyncActionResult<string>> {
    const client = getClient(ctx.config);

    if (!client.catalog.createProduct) {
      return {
        data: null,
        status: "failed",
        error: {
          code: RevstackErrorCode.NotImplemented,
          message: "Create product not supported",
        },
      };
    }

    return client.catalog.createProduct(ctx, input);
  }

  async getProduct(
    ctx: ProviderContext,
    input: GetProductInput,
  ): Promise<AsyncActionResult<Product>> {
    const client = getClient(ctx.config);

    if (!client.catalog.getProduct) {
      return {
        data: null,
        status: "failed",
        error: {
          code: RevstackErrorCode.NotImplemented,
          message: "Get product not supported",
        },
      };
    }

    return client.catalog.getProduct(ctx, input);
  }

  async updateProduct(
    ctx: ProviderContext,
    input: UpdateProductInput,
  ): Promise<AsyncActionResult<string>> {
    const client = getClient(ctx.config);

    if (!client.catalog.updateProduct) {
      return {
        data: null,
        status: "failed",
        error: {
          code: RevstackErrorCode.NotImplemented,
          message: "Update product not supported",
        },
      };
    }

    return client.catalog.updateProduct(ctx, input);
  }

  async deleteProduct(
    ctx: ProviderContext,
    input: DeleteProductInput,
  ): Promise<AsyncActionResult<boolean>> {
    const client = getClient(ctx.config);

    if (!client.catalog.deleteProduct) {
      return {
        data: false,
        status: "failed",
        error: {
          code: RevstackErrorCode.NotImplemented,
          message: "Delete product not supported",
        },
      };
    }

    return client.catalog.deleteProduct(ctx, input);
  }

  async listProducts(
    ctx: ProviderContext,
    options: ListProductsOptions,
  ): Promise<AsyncActionResult<PaginatedResult<Product>>> {
    const client = getClient(ctx.config);

    if (!client.catalog.listProducts) {
      return {
        data: null,
        status: "failed",
        error: {
          code: RevstackErrorCode.NotImplemented,
          message: "List products not supported",
        },
      };
    }

    return client.catalog.listProducts(ctx, options);
  }

  async createPrice(
    ctx: ProviderContext,
    input: CreatePriceInput,
  ): Promise<AsyncActionResult<string>> {
    const client = getClient(ctx.config);

    if (!client.catalog.createPrice) {
      return {
        data: null,
        status: "failed",
        error: {
          code: RevstackErrorCode.NotImplemented,
          message: "Create price not supported",
        },
      };
    }

    return client.catalog.createPrice(ctx, input);
  }

  async getPrice(
    ctx: ProviderContext,
    input: GetPriceInput,
  ): Promise<AsyncActionResult<Price>> {
    const client = getClient(ctx.config);

    if (!client.catalog.getPrice) {
      return {
        data: null,
        status: "failed",
        error: {
          code: RevstackErrorCode.NotImplemented,
          message: "Get price not supported",
        },
      };
    }

    return client.catalog.getPrice(ctx, input);
  }

  async listPrices(
    ctx: ProviderContext,
    options: ListPricesOptions,
  ): Promise<AsyncActionResult<PaginatedResult<Price>>> {
    const client = getClient(ctx.config);

    if (!client.catalog.listPrices) {
      return {
        data: null,
        status: "failed",
        error: {
          code: RevstackErrorCode.NotImplemented,
          message: "List prices not supported",
        },
      };
    }

    return client.catalog.listPrices(ctx, options);
  }

  // ===========================================================================
  // INVOICES
  // ===========================================================================

  async addInvoiceItem(
    ctx: ProviderContext,
    input: AddInvoiceItemInput,
  ): Promise<AsyncActionResult<string>> {
    const client = getClient(ctx.config);

    if (!client.invoices.addItem) {
      return {
        data: null,
        status: "failed",
        error: {
          code: RevstackErrorCode.NotImplemented,
          message: "Injecting invoice items not supported.",
        },
      };
    }

    return client.invoices.addItem(ctx, input);
  }

  async createInvoice(
    ctx: ProviderContext,
    input: CreateInvoiceInput,
  ): Promise<AsyncActionResult<string>> {
    const client = getClient(ctx.config);

    if (!client.invoices.create) {
      return {
        data: null,
        status: "failed",
        error: {
          code: RevstackErrorCode.NotImplemented,
          message: "Create invoice not supported.",
        },
      };
    }

    return client.invoices.create(ctx, input);
  }

  async getInvoice(
    ctx: ProviderContext,
    input: GetInvoiceInput,
  ): Promise<AsyncActionResult<Invoice>> {
    const client = getClient(ctx.config);

    if (!client.invoices.get) {
      return {
        data: null,
        status: "failed",
        error: {
          code: RevstackErrorCode.NotImplemented,
          message: "Get invoice not supported.",
        },
      };
    }

    return client.invoices.get(ctx, input);
  }

  async listInvoices(
    ctx: ProviderContext,
    options: ListInvoicesOptions,
  ): Promise<AsyncActionResult<PaginatedResult<Invoice>>> {
    const client = getClient(ctx.config);

    if (!client.invoices.list) {
      return {
        data: null,
        status: "failed",
        error: {
          code: RevstackErrorCode.NotImplemented,
          message: "List invoices not supported.",
        },
      };
    }

    return client.invoices.list(ctx, options);
  }

  // ===========================================================================
  // PROMOTIONS & DISCOUNTS
  // ===========================================================================

  async createCoupon(
    ctx: ProviderContext,
    input: CreateCouponInput,
  ): Promise<AsyncActionResult<string>> {
    const client = getClient(ctx.config);

    if (!client.promotions.createCoupon) {
      return {
        data: null,
        status: "failed",
        error: {
          code: RevstackErrorCode.NotImplemented,
          message: "Create coupon not supported.",
        },
      };
    }

    return client.promotions.createCoupon(ctx, input);
  }

  async getCoupon(
    ctx: ProviderContext,
    input: GetCouponInput,
  ): Promise<AsyncActionResult<Coupon>> {
    const client = getClient(ctx.config);

    if (!client.promotions.getCoupon) {
      return {
        data: null,
        status: "failed",
        error: {
          code: RevstackErrorCode.NotImplemented,
          message: "Get coupon not supported.",
        },
      };
    }

    return client.promotions.getCoupon(ctx, input);
  }
}
