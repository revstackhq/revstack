import Stripe from "stripe";
import { StripeProvider } from "@/provider";
import type { ProviderContext } from "@revstackhq/providers-core";

const STRIPE_API_VERSION = "2026-02-25.clover";

/**
 * Stripe Test Clock Lifecycle Scenario.
 *
 * Simulates an entire subscription billing cycle in seconds using Stripe's
 * Test Clocks API. This scenario is tagged as "slow" and must be run
 * explicitly via: `pnpm smoke stripe lifecycle`
 *
 * Flow:
 * 1. Create a Test Clock frozen at "now"
 * 2. Create customer + subscription attached to that clock
 * 3. Advance clock by 35 days (past the 30-day billing period)
 * 4. Poll for the invoice.paid event and assert it was processed
 * 5. Clean up all resources
 */
export async function runLifecycleScenario(
  ctx: ProviderContext,
  priceId: string,
): Promise<void> {
  const stripe = new Stripe(ctx.config.apiKey, {
    apiVersion: STRIPE_API_VERSION,
  });
  const provider = new StripeProvider();

  const state = {
    clockId: "",
    customerId: "",
    subscriptionId: "",
  };

  console.log("\n🕐 [Lifecycle] Starting Test Clock scenario...");

  try {
    // 1. CREATE TEST CLOCK ─────────────────────────────────────────────────────
    const frozenAt = Math.floor(Date.now() / 1000);
    const clock = await stripe.testHelpers.testClocks.create({
      frozen_time: frozenAt,
      name: `TCK-Lifecycle-${Date.now()}`,
    });
    state.clockId = clock.id;
    console.log(`   ✅ Clock created: ${clock.id}`);

    // 2. CREATE CUSTOMER ATTACHED TO CLOCK ────────────────────────────────────
    const customer = await stripe.customers.create({
      email: `lifecycle-${Date.now()}@revstack.test`,
      name: "TCK Lifecycle Customer",
      test_clock: clock.id,
    });
    state.customerId = customer.id;
    console.log(`   ✅ Customer created: ${customer.id}`);

    // 3. CREATE SUBSCRIPTION ───────────────────────────────────────────────────
    const sub = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_behavior: "default_incomplete",
      expand: ["latest_invoice.payment_intent"],
    });
    state.subscriptionId = sub.id;
    console.log(
      `   ✅ Subscription created: ${sub.id} (status: ${sub.status})`,
    );

    // 4. ADVANCE CLOCK 35 DAYS ─────────────────────────────────────────────────
    const advanceTo = frozenAt + 35 * 24 * 60 * 60;
    console.log(`   ⏩ Advancing clock by 35 days...`);

    await stripe.testHelpers.testClocks.advance(clock.id, {
      frozen_time: advanceTo,
    });

    // 5. POLL FOR CLOCK TO FINISH ADVANCING ───────────────────────────────────
    let advanced = false;
    for (let i = 0; i < 20; i++) {
      await new Promise((r) => setTimeout(r, 3000));
      const refreshed = await stripe.testHelpers.testClocks.retrieve(clock.id);
      if (refreshed.status === "ready") {
        advanced = true;
        break;
      }
      process.stdout.write(".");
    }

    if (!advanced) {
      throw new Error("Test clock did not finish advancing within 60 seconds.");
    }
    console.log(
      `\n   ✅ Clock advanced. Time is now: ${new Date(advanceTo * 1000).toISOString()}`,
    );

    // 6. ASSERT INVOICE WAS GENERATED ─────────────────────────────────────────
    const invoices = await stripe.invoices.list({
      customer: customer.id,
      limit: 5,
    });

    const renewalInvoice = invoices.data.find(
      (inv) => inv.status === "paid" || inv.status === "open",
    );

    if (!renewalInvoice) {
      throw new Error(
        `No renewal invoice found after advancing 35 days. ` +
          `Invoices: ${invoices.data.map((i) => `${i.id}(${i.status})`).join(", ")}`,
      );
    }
    console.log(
      `   ✅ Renewal invoice found: ${renewalInvoice.id} (${renewalInvoice.status})`,
    );

    // 7. ASSERT PROVIDER MAPPING VIA TCK ─────────────────────────────────────
    const invoiceRes = await provider.getInvoice(ctx, {
      id: renewalInvoice.id,
    });
    if (invoiceRes.status !== "success" || !invoiceRes.data) {
      throw new Error(`getInvoice failed: ${invoiceRes.error?.code}`);
    }

    const mapped = invoiceRes.data;
    if (!(mapped.createdAt instanceof Date)) {
      throw new Error(
        "TCK Violation: Invoice.createdAt is not a native Date object.",
      );
    }
    if (mapped.currency !== mapped.currency.toUpperCase()) {
      throw new Error(
        `TCK Violation: Invoice.currency "${mapped.currency}" is not uppercase.`,
      );
    }
    console.log(
      `   ✅ Invoice mapped correctly via provider. Currency: ${mapped.currency}`,
    );
  } finally {
    // 8. CLEANUP ───────────────────────────────────────────────────────────────
    console.log(`   🧹 Cleaning up lifecycle resources...`);

    if (state.subscriptionId) {
      await stripe.subscriptions.cancel(state.subscriptionId).catch(() => {});
    }
    if (state.customerId) {
      await stripe.customers.del(state.customerId).catch(() => {});
    }
    if (state.clockId) {
      await stripe.testHelpers.testClocks.del(state.clockId).catch(() => {});
    }

    console.log(`   ✅ Cleanup complete.\n`);
  }
}
