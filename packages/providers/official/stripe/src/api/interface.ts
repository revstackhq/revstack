import {
  ProviderContext,
  CreatePaymentInput,
  RefundPaymentInput,
  Payment,
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
  ApplyDiscountInput,
  PreviewSubscriptionUpdateInput,
  ProrationPreviewResult,
  CreateInvoiceInput,
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

  verifyWebhookSignature(
    ctx: ProviderContext,
    payload: string | Buffer,
    headers: Record<string, string | string[] | undefined>,
    secret: string,
  ): Promise<AsyncActionResult<boolean>>;

  parseWebhookEvent(
    payload: unknown,
  ): Promise<AsyncActionResult<RevstackEvent | null>>;

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

  listCustomers?(
    ctx: ProviderContext,
    options: ListCustomersOptions,
  ): Promise<AsyncActionResult<PaginatedResult<Customer>>>;

  createCheckoutSession?(
    ctx: ProviderContext,
    input: CheckoutSessionInput,
  ): Promise<AsyncActionResult<CheckoutSessionResult>>;

  setupPaymentMethod?(
    ctx: ProviderContext,
    input: SetupPaymentMethodInput,
  ): Promise<AsyncActionResult<CheckoutSessionResult>>;

  createPaymentLink?(
    ctx: ProviderContext,
    input: CreatePaymentLinkInput,
  ): Promise<AsyncActionResult<string>>;

  createBillingPortalSession?(
    ctx: ProviderContext,
    input: BillingPortalInput,
  ): Promise<AsyncActionResult<BillingPortalResult>>;

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

  listPaymentMethods?(
    ctx: ProviderContext,
    options: ListPaymentMethodsOptions,
  ): Promise<AsyncActionResult<PaymentMethod[]>>;

  deletePaymentMethod?(
    ctx: ProviderContext,
    input: DeletePaymentMethodInput,
  ): Promise<AsyncActionResult<boolean>>;

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

  previewSubscriptionUpdate?(
    ctx: ProviderContext,
    input: PreviewSubscriptionUpdateInput,
  ): Promise<AsyncActionResult<ProrationPreviewResult>>;

  createProduct?(
    ctx: ProviderContext,
    input: CreateProductInput,
  ): Promise<AsyncActionResult<string>>;

  getProduct?(
    ctx: ProviderContext,
    input: GetProductInput,
  ): Promise<AsyncActionResult<Product>>;

  updateProduct?(
    ctx: ProviderContext,
    input: UpdateProductInput,
  ): Promise<AsyncActionResult<string>>;

  deleteProduct?(
    ctx: ProviderContext,
    input: DeleteProductInput,
  ): Promise<AsyncActionResult<boolean>>;

  listProducts?(
    ctx: ProviderContext,
    options: ListProductsOptions,
  ): Promise<AsyncActionResult<PaginatedResult<Product>>>;

  createPrice?(
    ctx: ProviderContext,
    input: CreatePriceInput,
  ): Promise<AsyncActionResult<string>>;

  getPrice?(
    ctx: ProviderContext,
    input: GetPriceInput,
  ): Promise<AsyncActionResult<Price>>;

  listPrices?(
    ctx: ProviderContext,
    options: ListPricesOptions,
  ): Promise<AsyncActionResult<PaginatedResult<Price>>>;

  addInvoiceItem?(
    ctx: ProviderContext,
    input: AddInvoiceItemInput,
  ): Promise<AsyncActionResult<string>>;

  createInvoice?(
    ctx: ProviderContext,
    input: CreateInvoiceInput,
  ): Promise<AsyncActionResult<string>>;

  getInvoice?(
    ctx: ProviderContext,
    input: GetInvoiceInput,
  ): Promise<AsyncActionResult<Invoice>>;

  listInvoices?(
    ctx: ProviderContext,
    options: ListInvoicesOptions,
  ): Promise<AsyncActionResult<PaginatedResult<Invoice>>>;

  createCoupon?(
    ctx: ProviderContext,
    input: CreateCouponInput,
  ): Promise<AsyncActionResult<string>>;

  getCoupon?(
    ctx: ProviderContext,
    input: GetCouponInput,
  ): Promise<AsyncActionResult<Coupon>>;

  applyDiscount?(
    ctx: ProviderContext,
    input: ApplyDiscountInput,
  ): Promise<AsyncActionResult<boolean>>;
}
