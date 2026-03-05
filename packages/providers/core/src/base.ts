import { ProviderManifest } from "@/manifest";
import { ProviderContext } from "@/context";
import { InstallInput, InstallResult, UninstallInput } from "@/types/lifecycle";
import { RevstackEvent, WebhookResponse } from "@/types/events";
import { IProvider } from "@/interfaces/provider";
import { RevstackErrorCode } from "@/types/errors";
import {
  AsyncActionResult,
  PaginatedResult,
  PaginationOptions,
} from "@/types/shared";
import {
  CreatePaymentInput,
  Payment,
  RefundPaymentInput,
  GetPaymentInput,
  ListPaymentsOptions,
  CapturePaymentInput,
} from "@/types/payments";
import {
  CreateSubscriptionInput,
  Subscription,
  UpdateSubscriptionInput,
  CancelSubscriptionInput,
  PauseSubscriptionInput,
  ResumeSubscriptionInput,
  GetSubscriptionInput,
  ListSubscriptionsOptions,
} from "@/types/subscriptions";
import {
  CreateCustomerInput,
  Customer,
  UpdateCustomerInput,
  GetCustomerInput,
  DeleteCustomerInput,
  ListCustomersOptions,
} from "@/types/customers";
import {
  PaymentMethod,
  SetupPaymentMethodInput,
  ListPaymentMethodsOptions,
  DeletePaymentMethodInput,
} from "@/types/paymentMethods";
import { CheckoutSessionInput, CheckoutSessionResult } from "@/types/checkout";
import { BillingPortalInput, BillingPortalResult } from "@/types/portal";
import {
  Price,
  PriceInput,
  Product,
  ProductInput,
  GetProductInput,
  ListProductsOptions,
  UpdateProductInput,
  DeleteProductInput,
  GetPriceInput,
  ListPricesOptions,
} from "@/types/catalog";

export abstract class BaseProvider implements IProvider {
  private notImplemented(methodName: string): AsyncActionResult<any> {
    return {
      data: null,
      status: "failed",
      error: {
        code: RevstackErrorCode.NotImplemented,
        message: `Provider '${this.manifest.slug}' does not support ${methodName}.`,
      },
    };
  }

  // --- FEATURES ---

  async getPayment(
    ctx: ProviderContext,
    input: GetPaymentInput,
  ): Promise<AsyncActionResult<Payment>> {
    return this.notImplemented("getPayment");
  }

  async refundPayment(
    ctx: ProviderContext,
    input: RefundPaymentInput,
  ): Promise<AsyncActionResult<string>> {
    return this.notImplemented("refundPayment");
  }

  async listPayments(
    ctx: ProviderContext,
    options: ListPaymentsOptions,
  ): Promise<AsyncActionResult<PaginatedResult<Payment>>> {
    return this.notImplemented("listPayments");
  }

  async capturePayment(
    ctx: ProviderContext,
    input: CapturePaymentInput,
  ): Promise<AsyncActionResult<string>> {
    return this.notImplemented("capturePayment");
  }

  async getSubscription(
    ctx: ProviderContext,
    input: GetSubscriptionInput,
  ): Promise<AsyncActionResult<Subscription>> {
    return this.notImplemented("getSubscription");
  }

  async createCustomer(
    ctx: ProviderContext,
    input: CreateCustomerInput,
  ): Promise<AsyncActionResult<string>> {
    return this.notImplemented("createCustomer");
  }

  async updateCustomer(
    ctx: ProviderContext,
    input: UpdateCustomerInput,
  ): Promise<AsyncActionResult<string>> {
    return this.notImplemented("updateCustomer");
  }

  async deleteCustomer(
    ctx: ProviderContext,
    input: DeleteCustomerInput,
  ): Promise<AsyncActionResult<boolean>> {
    return this.notImplemented("deleteCustomer");
  }

  async getCustomer(
    ctx: ProviderContext,
    input: GetCustomerInput,
  ): Promise<AsyncActionResult<Customer>> {
    return this.notImplemented("getCustomer");
  }

  async listPaymentMethods(
    ctx: ProviderContext,
    options: ListPaymentMethodsOptions,
  ): Promise<AsyncActionResult<PaymentMethod[]>> {
    return this.notImplemented("listPaymentMethods");
  }

  async deletePaymentMethod(
    ctx: ProviderContext,
    input: DeletePaymentMethodInput,
  ): Promise<AsyncActionResult<boolean>> {
    return this.notImplemented("deletePaymentMethod");
  }

  abstract readonly manifest: ProviderManifest;

  // --- LIFECYCLE ---

  abstract onInstall(
    ctx: ProviderContext,
    input: InstallInput,
  ): Promise<AsyncActionResult<InstallResult>>;

  abstract onUninstall(
    ctx: ProviderContext,
    input: UninstallInput,
  ): Promise<AsyncActionResult<boolean>>;

  // --- WEBHOOKS ---

  abstract verifyWebhookSignature(
    ctx: ProviderContext,
    payload: string | Buffer,
    headers: Record<string, string | string[] | undefined>,
    secret: string,
  ): Promise<AsyncActionResult<boolean>>;

  abstract parseWebhookEvent(
    ctx: ProviderContext,
    payload: any,
  ): Promise<AsyncActionResult<RevstackEvent | null>>;

  async getWebhookResponse(
    ctx: ProviderContext,
  ): Promise<AsyncActionResult<WebhookResponse>> {
    return {
      data: {
        statusCode: 200,
        body: { received: true },
      },
      status: "success",
    };
  }

  // --- PAYMENT / SUBSCRIPTION / CHECKOUT (Optional Overrides) ---

  async createPayment(
    ctx: ProviderContext,
    input: CreatePaymentInput,
  ): Promise<AsyncActionResult<string>> {
    return this.notImplemented("createPayment");
  }

  async createSubscription(
    ctx: ProviderContext,
    input: CreateSubscriptionInput,
  ): Promise<AsyncActionResult<string>> {
    return this.notImplemented("createSubscription");
  }

  async cancelSubscription(
    ctx: ProviderContext,
    input: CancelSubscriptionInput,
  ): Promise<AsyncActionResult<string>> {
    return this.notImplemented("cancelSubscription");
  }

  async pauseSubscription(
    ctx: ProviderContext,
    input: PauseSubscriptionInput,
  ): Promise<AsyncActionResult<string>> {
    return this.notImplemented("pauseSubscription");
  }

  async resumeSubscription(
    ctx: ProviderContext,
    input: ResumeSubscriptionInput,
  ): Promise<AsyncActionResult<string>> {
    return this.notImplemented("resumeSubscription");
  }

  async createCheckoutSession(
    ctx: ProviderContext,
    input: CheckoutSessionInput,
  ): Promise<AsyncActionResult<CheckoutSessionResult>> {
    return this.notImplemented("createCheckoutSession");
  }

  async setupPaymentMethod(
    ctx: ProviderContext,
    input: SetupPaymentMethodInput,
  ): Promise<AsyncActionResult<CheckoutSessionResult>> {
    return this.notImplemented("setupPaymentMethod");
  }

  async createBillingPortalSession(
    ctx: ProviderContext,
    input: BillingPortalInput,
  ): Promise<AsyncActionResult<BillingPortalResult>> {
    return this.notImplemented("createBillingPortalSession");
  }

  async listSubscriptions(
    ctx: ProviderContext,
    options: ListSubscriptionsOptions,
  ): Promise<AsyncActionResult<PaginatedResult<Subscription>>> {
    return this.notImplemented("listSubscriptions");
  }

  async updateSubscription(
    ctx: ProviderContext,
    input: UpdateSubscriptionInput,
  ): Promise<AsyncActionResult<string>> {
    return this.notImplemented("updateSubscription");
  }

  async listCustomers(
    ctx: ProviderContext,
    options: ListCustomersOptions,
  ): Promise<AsyncActionResult<PaginatedResult<Customer>>> {
    return this.notImplemented("listCustomers");
  }

  // --- CATALOG (Optional Overrides) ---

  async createProduct(
    ctx: ProviderContext,
    input: ProductInput,
  ): Promise<AsyncActionResult<string>> {
    return this.notImplemented("createProduct");
  }

  async getProduct(
    ctx: ProviderContext,
    input: GetProductInput,
  ): Promise<AsyncActionResult<Product>> {
    return this.notImplemented("getProduct");
  }

  async listProducts(
    ctx: ProviderContext,
    options: ListProductsOptions,
  ): Promise<AsyncActionResult<PaginatedResult<Product>>> {
    return this.notImplemented("listProducts");
  }

  async updateProduct(
    ctx: ProviderContext,
    input: UpdateProductInput,
  ): Promise<AsyncActionResult<string>> {
    return this.notImplemented("updateProduct");
  }

  async deleteProduct(
    ctx: ProviderContext,
    input: DeleteProductInput,
  ): Promise<AsyncActionResult<boolean>> {
    return this.notImplemented("deleteProduct");
  }

  async createPrice(
    ctx: ProviderContext,
    input: PriceInput,
  ): Promise<AsyncActionResult<string>> {
    return this.notImplemented("createPrice");
  }

  async getPrice(
    ctx: ProviderContext,
    input: GetPriceInput,
  ): Promise<AsyncActionResult<Price>> {
    return this.notImplemented("getPrice");
  }

  async listPrices(
    ctx: ProviderContext,
    options: ListPricesOptions,
  ): Promise<AsyncActionResult<PaginatedResult<Price>>> {
    return this.notImplemented("listPrices");
  }
}
