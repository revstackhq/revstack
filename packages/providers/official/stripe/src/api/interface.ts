import {
  ProviderContext,
  CreatePaymentInput,
  RefundPaymentInput,
  Payment,
  PaginationOptions,
  PaginatedResult,
  CreateSubscriptionInput,
  UpdateSubscriptionInput,
  Subscription,
  CheckoutSessionInput,
  CheckoutSessionResult,
  BillingPortalInput,
  BillingPortalResult,
  SetupPaymentMethodInput,
  CreateCustomerInput,
  Customer,
  UpdateCustomerInput,
  PaymentMethod,
  InstallResult,
  AsyncActionResult,
  RevstackEvent,
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

export interface ProviderClient {
  validateCredentials(
    ctx: ProviderContext,
  ): Promise<AsyncActionResult<boolean>>;

  setupWebhooks?(
    ctx: ProviderContext,
    webhookUrl: string,
  ): Promise<AsyncActionResult<InstallResult>>;

  removeWebhooks?(
    ctx: ProviderContext,
    webhookId: string,
  ): Promise<AsyncActionResult<boolean>>;

  createPayment?(
    ctx: ProviderContext,
    input: CreatePaymentInput,
  ): Promise<AsyncActionResult<string>>;

  getPayment?(
    ctx: ProviderContext,
    input: GetPaymentInput,
  ): Promise<AsyncActionResult<Payment>>;

  refundPayment?(
    ctx: ProviderContext,
    input: RefundPaymentInput,
  ): Promise<AsyncActionResult<string>>;

  listPayments?(
    ctx: ProviderContext,
    options: ListPaymentsOptions,
  ): Promise<AsyncActionResult<PaginatedResult<Payment>>>;

  capturePayment?(
    ctx: ProviderContext,
    input: CapturePaymentInput,
  ): Promise<AsyncActionResult<string>>;

  createSubscription?(
    ctx: ProviderContext,
    input: CreateSubscriptionInput,
  ): Promise<AsyncActionResult<string>>;

  getSubscription?(
    ctx: ProviderContext,
    input: GetSubscriptionInput,
  ): Promise<AsyncActionResult<Subscription>>;

  cancelSubscription?(
    ctx: ProviderContext,
    input: CancelSubscriptionInput,
  ): Promise<AsyncActionResult<string>>;

  pauseSubscription?(
    ctx: ProviderContext,
    input: PauseSubscriptionInput,
  ): Promise<AsyncActionResult<string>>;

  resumeSubscription?(
    ctx: ProviderContext,
    input: ResumeSubscriptionInput,
  ): Promise<AsyncActionResult<string>>;

  listSubscriptions?(
    ctx: ProviderContext,
    options: ListSubscriptionsOptions,
  ): Promise<AsyncActionResult<PaginatedResult<Subscription>>>;

  updateSubscription?(
    ctx: ProviderContext,
    input: UpdateSubscriptionInput,
  ): Promise<AsyncActionResult<string>>;

  createCheckoutSession?(
    ctx: ProviderContext,
    input: CheckoutSessionInput,
  ): Promise<AsyncActionResult<CheckoutSessionResult>>;

  setupPaymentMethod?(
    ctx: ProviderContext,
    input: SetupPaymentMethodInput,
  ): Promise<AsyncActionResult<CheckoutSessionResult>>;

  createBillingPortalSession?(
    ctx: ProviderContext,
    input: BillingPortalInput,
  ): Promise<AsyncActionResult<BillingPortalResult>>;

  createCustomer(
    ctx: ProviderContext,
    input: CreateCustomerInput,
  ): Promise<AsyncActionResult<string>>;

  updateCustomer(
    ctx: ProviderContext,
    input: UpdateCustomerInput,
  ): Promise<AsyncActionResult<string>>;

  deleteCustomer?(
    ctx: ProviderContext,
    input: DeleteCustomerInput,
  ): Promise<AsyncActionResult<boolean>>;

  getCustomer?(
    ctx: ProviderContext,
    input: GetCustomerInput,
  ): Promise<AsyncActionResult<Customer>>;

  listPaymentMethods?(
    ctx: ProviderContext,
    options: ListPaymentMethodsOptions,
  ): Promise<AsyncActionResult<PaymentMethod[]>>;

  deletePaymentMethod?(
    ctx: ProviderContext,
    input: DeletePaymentMethodInput,
  ): Promise<AsyncActionResult<boolean>>;

  listCustomers?(
    ctx: ProviderContext,
    options: ListCustomersOptions,
  ): Promise<AsyncActionResult<PaginatedResult<Customer>>>;

  verifyWebhookSignature(
    ctx: ProviderContext,
    payload: string | Buffer,
    headers: Record<string, string | string[] | undefined>,
    secret: string,
  ): Promise<AsyncActionResult<boolean>>;

  parseWebhookEvent(
    payload: unknown,
  ): Promise<AsyncActionResult<RevstackEvent | null>>;
}
