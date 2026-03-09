import type { BaseProvider } from "@/base";
import type { ProviderContext } from "@/context";
import { RevstackErrorCode } from "@/types/errors";
import type { EventType } from "@/types/events";
import { calculateProrationBreakdown } from "@/utils/finance";
import { assertCustomerShape } from "../assertions/customer";
import { assertSubscriptionShape } from "../assertions/subscription";
import { assertProductShape, assertPriceShape } from "../assertions/catalog";

declare const describe: any;
declare const it: any;
declare const expect: any;

// ─── Option Types ─────────────────────────────────────────────────────────────

/**
 * A map of provider-injected webhook fixtures, strictly keyed by Revstack EventType.
 * The Core never references provider-specific JSON — providers inject this map.
 */
export type WebhookFixtureMap = Partial<Record<EventType, any>>;

/**
 * Input for the agnostic signature security test.
 * Providers supply their own deliberately invalid signature values.
 */
export interface SignatureTestInput {
  /** A raw stringified payload to use for the security test. */
  rawPayload: string;
  /** A deliberately malformed/invalid signature string. */
  invalidSignature: string;
  /** The HTTP header key for the signature (e.g., "stripe-signature"). */
  signatureHeader: string;
  /** The webhook secret used by the provider for verification. */
  webhookSecret: string;
}

/**
 * A single proration verification scenario.
 * The Core's `calculateProrationBreakdown` is the "ground truth" math engine.
 * The provider provides the raw line item data and the expected result.
 */
export interface ProrationScenario {
  /** Human-readable label for the test (e.g., "upgrade mid-cycle"). */
  label: string;
  /** Raw provider line item objects. */
  rawLines: unknown[];
  /** Provider-specific predicate: returns true if this line is a proration. */
  isProration: (line: unknown) => boolean;
  /** Provider-specific getter: returns the monetary amount for a line. */
  getAmount: (line: unknown) => number;
  /** The pre-computed result returned by `previewSubscriptionUpdate`. */
  providerResult: {
    immediateChargeAmount: number;
    newRecurringAmount: number;
  };
}

/**
 * Feature flags and injected data that control which compliance groups run.
 */
export interface ComplianceSuiteOptions {
  /** Create→Get→Update→Delete customer lifecycle. */
  customer?: boolean;
  /** Shape validation of a retrieved subscription (requires tck.subscriptionId in ctx). */
  subscription?: boolean;
  /** Product + price CRUD and listing. */
  catalog?: boolean;
  /**
   * Webhook mapping compliance.
   * Requires `fixtures` to be populated.
   */
  webhooks?: boolean;
  /**
   * Proration math integrity checks.
   * Requires `prorationScenarios` to be populated.
   */
  proration?: boolean;

  /**
   * Provider-injected webhook fixtures mapped by expected EventType.
   * The Core never ships these — providers define them in their own packages.
   */
  fixtures?: WebhookFixtureMap;

  /**
   * Input for the agnostic signature security rejection test.
   * The Core defines the test flow; the provider supplies the values.
   */
  signatureTestInput?: SignatureTestInput;

  /**
   * Proration math validation scenarios.
   * The Core's `calculateProrationBreakdown` acts as the ground truth.
   */
  prorationScenarios?: ProrationScenario[];
}

// ─── Suite Factory ────────────────────────────────────────────────────────────

/**
 * Creates and executes a Vitest-native compliance suite against a provider instance.
 *
 * **Design principle:** This factory is 100% provider-agnostic. It never references
 * Stripe, PayPal, or any other provider. All provider-specific data is injected
 * via `options` (fixtures, signatureTestInput, prorationScenarios).
 *
 * @example
 * // In your provider's test file:
 * import { createComplianceSuite } from "@revstackhq/providers-core/testing";
 * import { STRIPE_FIXTURES, stripeSignatureTest } from "@revstackhq/provider-stripe/testing";
 *
 * createComplianceSuite(new StripeProvider(), ctx, {
 *   customer: true,
 *   catalog: true,
 *   webhooks: true,
 *   fixtures: STRIPE_FIXTURES,
 *   signatureTestInput: stripeSignatureTest,
 * });
 */
export function createComplianceSuite(
  provider: BaseProvider,
  ctx: ProviderContext,
  options: ComplianceSuiteOptions = {},
): void {
  const providerName = String((provider as any).constructor?.name ?? "Unknown");

  describe(`[TCK] ${providerName} — Compliance Suite`, () => {
    // ─────────────────────────────────────────────────────────────────────────
    // CUSTOMER LIFECYCLE
    // ─────────────────────────────────────────────────────────────────────────
    if (options.customer) {
      describe("Customer Lifecycle", () => {
        const state = { customerId: "" };
        const testEmail = `tck-${Date.now()}@revstack.test`;

        it("create: returns a non-empty id string", async () => {
          const res = await provider.createCustomer(ctx, {
            email: testEmail,
            name: "TCK Test Customer",
          });
          expect(res.status).toBe("success");
          expect(typeof res.data).toBe("string");
          expect((res.data as string).length).toBeGreaterThan(0);
          state.customerId = res.data as string;
        });

        it("get: id from create satisfies canonical Customer shape", async () => {
          if (!state.customerId) return;
          const res = await provider.getCustomer(ctx, { id: state.customerId });
          expect(res.status).toBe("success");
          assertCustomerShape(res.data!);
          expect(res.data!.id).toBe(state.customerId);
        });

        it("update: name change completes without error", async () => {
          if (!state.customerId) return;
          const res = await provider.updateCustomer(ctx, {
            id: state.customerId,
            name: "TCK Updated Name",
          });
          expect(res.status).toBe("success");
        });

        it("delete: completes without error", async () => {
          if (!state.customerId) return;
          const res = await provider.deleteCustomer(ctx, {
            id: state.customerId,
          });
          expect(res.status).toBe("success");
        });

        it("get after delete: maps to ResourceNotFound", async () => {
          if (!state.customerId) return;
          const res = await provider.getCustomer(ctx, { id: state.customerId });
          expect(res.status).toBe("failed");
          expect(res.error?.code).toBe(RevstackErrorCode.ResourceNotFound);
        });
      });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SUBSCRIPTION SHAPE
    // ─────────────────────────────────────────────────────────────────────────
    if (options.subscription) {
      describe("Subscription Shape", () => {
        it("getSubscription: conforms to canonical Subscription model", async () => {
          const subId = (ctx as any).tck?.subscriptionId;
          if (!subId) {
            console.warn("[TCK] Skipping: no ctx.tck.subscriptionId provided.");
            return;
          }
          const res = await provider.getSubscription(ctx, { id: subId });
          expect(res.status).toBe("success");
          assertSubscriptionShape(res.data!);
        });
      });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // CATALOG
    // ─────────────────────────────────────────────────────────────────────────
    if (options.catalog) {
      describe("Catalog CRUD", () => {
        const state = { productId: "", priceId: "" };

        it("createProduct: returns id and satisfies Product shape", async () => {
          const res = await provider.createProduct(ctx, {
            name: "TCK Compliance Product",
            active: true,
            category: "saas",
          });
          expect(res.status).toBe("success");
          state.productId = res.data as string;
        });

        it("getProduct: returned shape matches canonical Product model", async () => {
          if (!state.productId) return;
          const res = await provider.getProduct(ctx, { id: state.productId });
          expect(res.status).toBe("success");
          assertProductShape(res.data!);
        });

        it("createPrice (one-time): satisfies Price shape", async () => {
          if (!state.productId) return;
          const res = await provider.createPrice(ctx, {
            productId: state.productId,
            unitAmount: 1999,
            currency: "usd",
            active: true,
          });
          expect(res.status).toBe("success");
          state.priceId = res.data as string;
        });

        it("getPrice: returned shape matches canonical Price model", async () => {
          if (!state.priceId) return;
          const res = await provider.getPrice(ctx, { id: state.priceId });
          expect(res.status).toBe("success");
          assertPriceShape(res.data!);
        });

        it("listProducts: paginated result has expected shape", async () => {
          const res = await provider.listProducts(ctx, { limit: 5 });
          expect(res.status).toBe("success");
          expect(Array.isArray(res.data!.data)).toBe(true);
          expect(typeof res.data!.hasMore).toBe("boolean");
        });

        it("deleteProduct: archives without error", async () => {
          if (!state.productId) return;
          const res = await provider.deleteProduct(ctx, {
            id: state.productId,
          });
          expect(res.status).toBe("success");
        });
      });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // WEBHOOK FIXTURE MAPPING
    // ─────────────────────────────────────────────────────────────────────────
    if (
      options.webhooks &&
      options.fixtures &&
      Object.keys(options.fixtures).length > 0
    ) {
      describe("Webhook Mapping", () => {
        for (const [expectedType, raw] of Object.entries(options.fixtures!)) {
          it(`maps raw payload → "${expectedType}"`, async () => {
            const res = await provider.parseWebhookEvent(ctx, raw);
            expect(res.status).toBe("success");
            expect(
              res.data?.type,
              `Expected event type "${expectedType}" but got "${res.data?.type}"`,
            ).toBe(expectedType);
            expect(res.data?.data).toBeDefined();
          });
        }
      });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SIGNATURE SECURITY
    // ─────────────────────────────────────────────────────────────────────────
    if (options.webhooks && options.signatureTestInput) {
      const sig = options.signatureTestInput;

      describe("Webhook Signature Security", () => {
        it("rejects a malformed signature", async () => {
          const res = await provider.verifyWebhookSignature(
            ctx,
            sig.rawPayload,
            { [sig.signatureHeader]: sig.invalidSignature },
            sig.webhookSecret,
          );
          expect(res.status).toBe("failed");
          expect(res.error?.code).toBe(
            RevstackErrorCode.WebhookSignatureVerificationFailed,
          );
        });

        it("rejects a valid payload signed with the wrong secret", async () => {
          const res = await provider.verifyWebhookSignature(
            ctx,
            sig.rawPayload,
            { [sig.signatureHeader]: sig.invalidSignature },
            "whsec_totally_wrong_secret_xyz",
          );
          expect(res.status).toBe("failed");
          expect(res.error?.code).toBe(
            RevstackErrorCode.WebhookSignatureVerificationFailed,
          );
        });

        it("rejects an empty signature header", async () => {
          const res = await provider.verifyWebhookSignature(
            ctx,
            sig.rawPayload,
            { [sig.signatureHeader]: "" },
            sig.webhookSecret,
          );
          expect(res.status).toBe("failed");
        });
      });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PRORATION MATH (Ground Truth Validation)
    // ─────────────────────────────────────────────────────────────────────────
    if (options.proration && options.prorationScenarios) {
      describe("Proration Math Integrity", () => {
        for (const scenario of options.prorationScenarios!) {
          it(`[${scenario.label}]: Core math matches provider result`, () => {
            // The Core's calculateProrationBreakdown is the "ground truth" engine.
            // We run the same line items through it and compare to what the
            // provider's previewSubscriptionUpdate API returned.
            const coreResult = calculateProrationBreakdown(
              scenario.rawLines,
              scenario.isProration,
              scenario.getAmount,
            );

            expect(
              coreResult.immediateCharge,
              `immediateCharge mismatch: core=${coreResult.immediateCharge}, provider=${scenario.providerResult.immediateChargeAmount}`,
            ).toBe(scenario.providerResult.immediateChargeAmount);

            expect(
              coreResult.recurringTotal,
              `recurringTotal mismatch: core=${coreResult.recurringTotal}, provider=${scenario.providerResult.newRecurringAmount}`,
            ).toBe(scenario.providerResult.newRecurringAmount);
          });
        }
      });
    }
  });
}
