import { ProviderContext } from "@/context";
import { CreateMeterInput, IngestEventInput } from "@/types/billing";
import { AsyncActionResult } from "@/types/shared";

export interface IBillingFeature {
  /**
   * Registers a new usage metric (Meter) with the provider.
   *
   * Only required when `billing.features.requiresMeterCreation` is `true`.
   * Must be called before any `ingestEvent` calls for that `eventName`.
   *
   * @param ctx - The provider execution context (credentials, tenant, etc.).
   * @param input - The meter definition.
   * @returns The provider's meter ID or object on success.
   */
  createMeter?(
    ctx: ProviderContext,
    input: CreateMeterInput,
  ): Promise<AsyncActionResult<string>>;

  /**
   * Streams a single raw usage event to the provider's native metering API.
   *
   * @param ctx - The provider execution context (credentials, tenant, etc.).
   * @param input - The usage event data point.
   * @returns Resolves with void on success; the provider handles aggregation.
   */
  ingestEvent?(
    ctx: ProviderContext,
    input: IngestEventInput,
  ): Promise<AsyncActionResult<void>>;
}
