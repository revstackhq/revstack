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
  CreateMeterInput,
  IngestEventInput,
} from "@revstackhq/providers-core";

// ─── Namespace: Webhooks ──────────────────────────────────────────────────────

export interface WebhooksClient {
  validateCredentials(
    ctx: ProviderContext,
  ): Promise<AsyncActionResult<boolean>>;

  setup?(
    ctx: ProviderContext,
    webhookUrl: string,
  ): Promise<AsyncActionResult<InstallResult>>;

  remove?(
    ctx: ProviderContext,
    webhookId: string,
  ): Promise<AsyncActionResult<boolean>>;

  verify(
    ctx: ProviderContext,
    payload: string | Buffer,
    headers: Record<string, string | string[] | undefined>,
    secret: string,
  ): Promise<AsyncActionResult<boolean>>;

  parse(
    ctx: ProviderContext,
    payload: unknown,
  ): Promise<AsyncActionResult<RevstackEvent | null>>;
}

// ─── Namespace: Customers ─────────────────────────────────────────────────────

export interface CustomersClient {
  create(
    ctx: ProviderContext,
    input: CreateCustomerInput,
  ): Promise<AsyncActionResult<string>>;

  update(
    ctx: ProviderContext,
    input: UpdateCustomerInput,
  ): Promise<AsyncActionResult<string>>;

  delete?(
    ctx: ProviderContext,
    input: DeleteCustomerInput,
  ): Promise<AsyncActionResult<boolean>>;

  get?(
    ctx: ProviderContext,
    input: GetCustomerInput,
  ): Promise<AsyncActionResult<Customer>>;

  list?(
    ctx: ProviderContext,
    options: ListCustomersOptions,
  ): Promise<AsyncActionResult<PaginatedResult<Customer>>>;
}

// ─── Namespace: Checkout ──────────────────────────────────────────────────────

export interface CheckoutClient {
  createSession?(
    ctx: ProviderContext,
    input: CheckoutSessionInput,
  ): Promise<AsyncActionResult<CheckoutSessionResult>>;

  createBillingPortal?(
    ctx: ProviderContext,
    input: BillingPortalInput,
  ): Promise<AsyncActionResult<BillingPortalResult>>;

  createPaymentLink?(
    ctx: ProviderContext,
    input: CreatePaymentLinkInput,
  ): Promise<AsyncActionResult<string>>;
}

// ─── Namespace: Payment Methods ───────────────────────────────────────────────

export interface PaymentMethodsClient {
  setup?(
    ctx: ProviderContext,
    input: SetupPaymentMethodInput,
  ): Promise<AsyncActionResult<CheckoutSessionResult>>;

  list?(
    ctx: ProviderContext,
    options: ListPaymentMethodsOptions,
  ): Promise<AsyncActionResult<PaymentMethod[]>>;

  delete?(
    ctx: ProviderContext,
    input: DeletePaymentMethodInput,
  ): Promise<AsyncActionResult<boolean>>;
}

// ─── Namespace: Payments ──────────────────────────────────────────────────────

export interface PaymentsClient {
  create?(
    ctx: ProviderContext,
    input: CreatePaymentInput,
  ): Promise<AsyncActionResult<string>>;

  get?(
    ctx: ProviderContext,
    input: GetPaymentInput,
  ): Promise<AsyncActionResult<Payment>>;

  refund?(
    ctx: ProviderContext,
    input: RefundPaymentInput,
  ): Promise<AsyncActionResult<string>>;

  list?(
    ctx: ProviderContext,
    options: ListPaymentsOptions,
  ): Promise<AsyncActionResult<PaginatedResult<Payment>>>;

  capture?(
    ctx: ProviderContext,
    input: CapturePaymentInput,
  ): Promise<AsyncActionResult<string>>;
}

// ─── Namespace: Subscriptions ─────────────────────────────────────────────────

export interface SubscriptionsClient {
  create?(
    ctx: ProviderContext,
    input: CreateSubscriptionInput,
  ): Promise<AsyncActionResult<string>>;

  get?(
    ctx: ProviderContext,
    input: GetSubscriptionInput,
  ): Promise<AsyncActionResult<Subscription>>;

  cancel?(
    ctx: ProviderContext,
    input: CancelSubscriptionInput,
  ): Promise<AsyncActionResult<string>>;

  pause?(
    ctx: ProviderContext,
    input: PauseSubscriptionInput,
  ): Promise<AsyncActionResult<string>>;

  resume?(
    ctx: ProviderContext,
    input: ResumeSubscriptionInput,
  ): Promise<AsyncActionResult<string>>;

  list?(
    ctx: ProviderContext,
    options: ListSubscriptionsOptions,
  ): Promise<AsyncActionResult<PaginatedResult<Subscription>>>;

  update?(
    ctx: ProviderContext,
    input: UpdateSubscriptionInput,
  ): Promise<AsyncActionResult<string>>;

  preview?(
    ctx: ProviderContext,
    input: PreviewSubscriptionUpdateInput,
  ): Promise<AsyncActionResult<ProrationPreviewResult>>;
}

// ─── Namespace: Catalog ───────────────────────────────────────────────────────

export interface CatalogClient {
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
}

// ─── Namespace: Invoices ──────────────────────────────────────────────────────

export interface InvoicesClient {
  addItem?(
    ctx: ProviderContext,
    input: AddInvoiceItemInput,
  ): Promise<AsyncActionResult<string>>;

  create?(
    ctx: ProviderContext,
    input: CreateInvoiceInput,
  ): Promise<AsyncActionResult<string>>;

  get?(
    ctx: ProviderContext,
    input: GetInvoiceInput,
  ): Promise<AsyncActionResult<Invoice>>;

  list?(
    ctx: ProviderContext,
    options: ListInvoicesOptions,
  ): Promise<AsyncActionResult<PaginatedResult<Invoice>>>;
}

// ─── Namespace: Promotions ────────────────────────────────────────────────────

export interface PromotionsClient {
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

// ─── Namespace: Billing ──────────────────────────────────────────────────────

export interface BillingClient {
  createMeter?(
    ctx: ProviderContext,
    input: CreateMeterInput,
  ): Promise<AsyncActionResult<string>>;

  ingestEvent?(
    ctx: ProviderContext,
    input: IngestEventInput,
  ): Promise<AsyncActionResult<void>>;
}

// ─── Root ProviderClient ──────────────────────────────────────────────────────

export interface ProviderClient {
  webhooks: WebhooksClient;
  customers: CustomersClient;
  checkout: CheckoutClient;
  payments: PaymentsClient;
  subscriptions: SubscriptionsClient;
  catalog: CatalogClient;
  promotions: PromotionsClient;
  billing: BillingClient;
}
