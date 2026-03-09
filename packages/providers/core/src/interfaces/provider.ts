import { ProviderContext } from "@/context";
import { ICatalogFeature } from "@/interfaces/features/catalog";
import { ICheckoutFeature } from "@/interfaces/features/checkout";
import { ICustomerFeature } from "@/interfaces/features/customer";
import { IInvoiceFeature } from "@/interfaces/features/invoice";
import { IPaymentFeature } from "@/interfaces/features/payment";
import { IPaymentMethodFeature } from "@/interfaces/features/paymentMethod";
import { IBillingPortalFeature } from "@/interfaces/features/portal";
import { IPromotionFeature } from "@/interfaces/features/promotion";
import { ISubscriptionFeature } from "@/interfaces/features/subscription";
import { ProviderManifest } from "@/manifest";
import { RevstackEvent, WebhookResponse } from "@/types/events";
import { InstallInput, InstallResult, UninstallInput } from "@/types/lifecycle";
import { AsyncActionResult } from "@/types/shared";

export interface IProvider
  extends
    IPaymentFeature,
    ISubscriptionFeature,
    ICheckoutFeature,
    ICustomerFeature,
    IBillingPortalFeature,
    IPaymentMethodFeature,
    ICatalogFeature,
    IPromotionFeature,
    IInvoiceFeature {
  readonly manifest: ProviderManifest;

  onInstall(
    ctx: ProviderContext,
    input: InstallInput,
  ): Promise<AsyncActionResult<InstallResult>>;

  onUninstall(
    ctx: ProviderContext,
    input: UninstallInput,
  ): Promise<AsyncActionResult<boolean>>;

  verifyWebhookSignature(
    ctx: ProviderContext,
    payload: string | Buffer,
    headers: Record<string, string | string[] | undefined>,
    secret: string,
  ): Promise<AsyncActionResult<boolean>>;

  parseWebhookEvent(
    ctx: ProviderContext,
    payload: any,
  ): Promise<AsyncActionResult<RevstackEvent | null>>;

  getWebhookResponse(
    ctx: ProviderContext,
  ): Promise<AsyncActionResult<WebhookResponse>>;
}
