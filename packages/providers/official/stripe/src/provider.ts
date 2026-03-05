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
  PaginationOptions,
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
} from "@revstackhq/providers-core";

export class StripeProvider extends BaseProvider {
  static manifest = manifest;
  manifest = manifest;

  async onInstall(
    ctx: ProviderContext,
    input: InstallInput,
  ): Promise<AsyncActionResult<InstallResult>> {
    const client = getClient(input.config);
    const installVersion = manifest.version;

    const isValid = await client.validateCredentials({
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

    if (client.setupWebhooks && input.webhookUrl) {
      try {
        const wh = await client.setupWebhooks(
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

    if (client.removeWebhooks && input.data.webhookEndpointId) {
      try {
        await client.removeWebhooks(
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
    return client.verifyWebhookSignature(ctx, payload, headers, secret);
  }

  async parseWebhookEvent(
    ctx: ProviderContext,
    payload: any,
  ): Promise<AsyncActionResult<RevstackEvent | null>> {
    const client = getClient(ctx.config);
    return client.parseWebhookEvent(payload);
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

    if (!client.createPayment) {
      return {
        data: null,
        status: "failed",
        error: {
          code: RevstackErrorCode.NotImplemented,
          message: `Provider '${this.manifest.slug}' does not support createPayment.`,
        },
      };
    }

    return client.createPayment(ctx, input);
  }

  async getPayment(
    ctx: ProviderContext,
    input: GetPaymentInput,
  ): Promise<AsyncActionResult<Payment>> {
    const client = getClient(ctx.config);

    if (!client.getPayment) {
      return {
        data: null,
        status: "failed",
        error: {
          code: RevstackErrorCode.NotImplemented,
          message: "Get payment not supported",
        },
      };
    }

    return client.getPayment(ctx, input);
  }

  async refundPayment(
    ctx: ProviderContext,
    input: RefundPaymentInput,
  ): Promise<AsyncActionResult<string>> {
    const client = getClient(ctx.config);

    if (!client.refundPayment) {
      return {
        data: null,
        status: "failed",
        error: {
          code: RevstackErrorCode.NotImplemented,
          message: "Refunds not supported by this provider version",
        },
      };
    }

    return client.refundPayment(ctx, input);
  }

  async listPayments(
    ctx: ProviderContext,
    options: ListPaymentsOptions,
  ): Promise<AsyncActionResult<PaginatedResult<Payment>>> {
    const client = getClient(ctx.config);

    if (!client.listPayments) {
      return {
        data: null,
        status: "failed",
        error: {
          code: RevstackErrorCode.NotImplemented,
          message: "List payments not supported",
        },
      };
    }

    return client.listPayments(ctx, options);
  }

  // ===========================================================================
  // SUBSCRIPTIONS
  // ===========================================================================

  async createSubscription(
    ctx: ProviderContext,
    input: CreateSubscriptionInput,
  ): Promise<AsyncActionResult<string>> {
    const client = getClient(ctx.config);

    if (!client.createSubscription) {
      return {
        data: null,
        status: "failed",
        error: {
          code: RevstackErrorCode.NotImplemented,
          message: "Subscriptions not supported",
        },
      };
    }

    return client.createSubscription(ctx, input);
  }

  async getSubscription(
    ctx: ProviderContext,
    input: GetSubscriptionInput,
  ): Promise<AsyncActionResult<Subscription>> {
    const client = getClient(ctx.config);

    if (!client.getSubscription) {
      return {
        data: null,
        status: "failed",
        error: {
          code: RevstackErrorCode.NotImplemented,
          message: "Get subscription not supported",
        },
      };
    }

    return client.getSubscription(ctx, input);
  }

  async cancelSubscription(
    ctx: ProviderContext,
    input: CancelSubscriptionInput,
  ): Promise<AsyncActionResult<string>> {
    const client = getClient(ctx.config);

    if (!client.cancelSubscription) {
      return {
        data: null,
        status: "failed",
        error: {
          code: RevstackErrorCode.NotImplemented,
          message: "Cancel subscription not supported",
        },
      };
    }

    return client.cancelSubscription(ctx, input);
  }

  async pauseSubscription(
    ctx: ProviderContext,
    input: PauseSubscriptionInput,
  ): Promise<AsyncActionResult<string>> {
    const client = getClient(ctx.config);

    if (!client.pauseSubscription) {
      return {
        data: null,
        status: "failed",
        error: {
          code: RevstackErrorCode.NotImplemented,
          message: "Pause subscription not supported",
        },
      };
    }

    return client.pauseSubscription(ctx, input);
  }

  async resumeSubscription(
    ctx: ProviderContext,
    input: ResumeSubscriptionInput,
  ): Promise<AsyncActionResult<string>> {
    const client = getClient(ctx.config);

    if (!client.resumeSubscription) {
      return {
        data: null,
        status: "failed",
        error: {
          code: RevstackErrorCode.NotImplemented,
          message: "Resume subscription not supported",
        },
      };
    }

    return client.resumeSubscription(ctx, input);
  }

  // ===========================================================================
  // CHECKOUT
  // ===========================================================================

  async createCheckoutSession(
    ctx: ProviderContext,
    input: CheckoutSessionInput,
  ): Promise<AsyncActionResult<CheckoutSessionResult>> {
    const client = getClient(ctx.config);

    if (!client.createCheckoutSession) {
      return {
        data: null,
        status: "failed",
        error: {
          code: RevstackErrorCode.NotImplemented,
          message: "Checkout not supported",
        },
      };
    }

    return client.createCheckoutSession(ctx, input);
  }

  // ===========================================================================
  // CUSTOMERS
  // ===========================================================================

  async createCustomer(
    ctx: ProviderContext,
    input: CreateCustomerInput,
  ): Promise<AsyncActionResult<string>> {
    const client = getClient(ctx.config);

    if (!client.createCustomer) {
      return {
        data: null,
        status: "failed",
        error: {
          code: RevstackErrorCode.NotImplemented,
          message: "Customer management not supported",
        },
      };
    }

    return client.createCustomer(ctx, input);
  }

  async updateCustomer(
    ctx: ProviderContext,
    input: UpdateCustomerInput,
  ): Promise<AsyncActionResult<string>> {
    const client = getClient(ctx.config);

    if (!client.updateCustomer) {
      return {
        data: null,
        status: "failed",
        error: {
          code: RevstackErrorCode.NotImplemented,
          message: "Customer update not supported",
        },
      };
    }

    return client.updateCustomer(ctx, input);
  }

  async deleteCustomer(
    ctx: ProviderContext,
    input: DeleteCustomerInput,
  ): Promise<AsyncActionResult<boolean>> {
    const client = getClient(ctx.config);

    if (!client.deleteCustomer) {
      return {
        data: false,
        status: "failed",
        error: {
          code: RevstackErrorCode.NotImplemented,
          message: "Customer deletion not supported",
        },
      };
    }

    return client.deleteCustomer(ctx, input);
  }

  async getCustomer(
    ctx: ProviderContext,
    input: GetCustomerInput,
  ): Promise<AsyncActionResult<Customer>> {
    const client = getClient(ctx.config);

    if (!client.getCustomer) {
      return {
        data: null,
        status: "failed",
        error: {
          code: RevstackErrorCode.NotImplemented,
          message: "Get customer not supported",
        },
      };
    }

    return client.getCustomer(ctx, input);
  }

  // ===========================================================================
  // PAYMENT METHODS
  // ===========================================================================

  async listPaymentMethods(
    ctx: ProviderContext,
    options: ListPaymentMethodsOptions,
  ): Promise<AsyncActionResult<PaymentMethod[]>> {
    const client = getClient(ctx.config);

    if (!client.listPaymentMethods) {
      return {
        data: null,
        status: "failed",
        error: {
          code: RevstackErrorCode.NotImplemented,
          message: "List payment methods not supported",
        },
      };
    }

    return client.listPaymentMethods(ctx, options);
  }

  async deletePaymentMethod(
    ctx: ProviderContext,
    input: DeletePaymentMethodInput,
  ): Promise<AsyncActionResult<boolean>> {
    const client = getClient(ctx.config);

    if (!client.deletePaymentMethod) {
      return {
        data: false,
        status: "failed",
        error: {
          code: RevstackErrorCode.NotImplemented,
          message: "Delete payment method not supported",
        },
      };
    }

    return client.deletePaymentMethod(ctx, input);
  }

  // ===========================================================================
  // ADDITIONAL METHODS
  // ===========================================================================

  async capturePayment(
    ctx: ProviderContext,
    input: CapturePaymentInput,
  ): Promise<AsyncActionResult<string>> {
    const client = getClient(ctx.config);

    if (!client.capturePayment) {
      return {
        data: null,
        status: "failed",
        error: {
          code: RevstackErrorCode.NotImplemented,
          message: "Capture not supported",
        },
      };
    }

    return client.capturePayment(ctx, input);
  }

  async listSubscriptions(
    ctx: ProviderContext,
    options: ListSubscriptionsOptions,
  ): Promise<AsyncActionResult<PaginatedResult<Subscription>>> {
    const client = getClient(ctx.config);

    if (!client.listSubscriptions) {
      return {
        data: null,
        status: "failed",
        error: {
          code: RevstackErrorCode.NotImplemented,
          message: "List subscriptions not supported",
        },
      };
    }

    return client.listSubscriptions(ctx, options);
  }

  async updateSubscription(
    ctx: ProviderContext,
    input: UpdateSubscriptionInput,
  ): Promise<AsyncActionResult<string>> {
    const client = getClient(ctx.config);

    if (!client.updateSubscription) {
      return {
        data: null,
        status: "failed",
        error: {
          code: RevstackErrorCode.NotImplemented,
          message: "Update subscription not supported",
        },
      };
    }

    return client.updateSubscription(ctx, input);
  }

  async listCustomers(
    ctx: ProviderContext,
    options: ListCustomersOptions,
  ): Promise<AsyncActionResult<PaginatedResult<Customer>>> {
    const client = getClient(ctx.config);

    if (!client.listCustomers) {
      return {
        data: null,
        status: "failed",
        error: {
          code: RevstackErrorCode.NotImplemented,
          message: "List customers not supported",
        },
      };
    }

    return client.listCustomers(ctx, options);
  }

  async setupPaymentMethod(
    ctx: ProviderContext,
    input: SetupPaymentMethodInput,
  ): Promise<AsyncActionResult<CheckoutSessionResult>> {
    const client = getClient(ctx.config);

    if (!client.setupPaymentMethod) {
      return {
        data: null,
        status: "failed",
        error: {
          code: RevstackErrorCode.NotImplemented,
          message: "Setup payment method not supported",
        },
      };
    }

    return client.setupPaymentMethod(ctx, input);
  }

  async createBillingPortalSession(
    ctx: ProviderContext,
    input: BillingPortalInput,
  ): Promise<AsyncActionResult<BillingPortalResult>> {
    const client = getClient(ctx.config);

    if (!client.createBillingPortalSession) {
      return {
        data: null,
        status: "failed",
        error: {
          code: RevstackErrorCode.NotImplemented,
          message: "Billing portal not supported",
        },
      };
    }

    return client.createBillingPortalSession(ctx, input);
  }
}
