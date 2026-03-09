import { StripeProvider } from "@/provider";
import { ProviderContext, runSmoke } from "@revstackhq/providers-core";
import { runLifecycleScenario } from "@/smoke/lifecycle";
import Stripe from "stripe";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env.test") });

const STRIPE_API_VERSION = "2026-02-25.clover";
const provider = new StripeProvider();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: STRIPE_API_VERSION,
});

const STATE = {
  customerId: "",
  productId: "",
  priceId: "",
  recurringPriceId: "",
  subscriptionId: "",
  paymentId: "",
  couponId: "",
  webhookEndpointId: process.env.STRIPE_WEBHOOK_ENDPOINT_ID || "",
};

const FIXTURES = {
  webhookUrl: process.env.STRIPE_WEBHOOK_URL || "https://example.com/webhook",
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "whsec_test",
  returnUrl: "https://example.com/return",
};

const ctx: ProviderContext = {
  isTestMode: true,
  traceId: `smoke-${Date.now()}`,
  config: {
    apiKey: process.env.STRIPE_SECRET_KEY!,
    useStripeTax: false,
  },
};

const getStepCtx = (step: string) => ({
  ...ctx,
  idempotencyKey: `${ctx.traceId}-${step}`,
});

// ─── SMOKE TEST RUNNER ────────────────────────────────────────────────────────

runSmoke({
  provider,
  ctx,
  manifest: StripeProvider.manifest,
  bail: false,
  scenarios: {
    // ─── CATALOG & PROMOTIONS ─────────────────────────────────────────────────

    createProduct: async (c) => {
      const res = await provider.createProduct(getStepCtx("create-prod"), {
        name: "Smoke Test JIT Product",
        description: "Created during smoke test",
        active: true,
        metadata: { smoke: "true", traceId: ctx.traceId },
        category: "saas",
      });
      if (res.data) STATE.productId = res.data;
      return res;
    },

    createPrice: async (c) => {
      if (!STATE.productId) throw new Error("Missing productId");

      // One-time price
      const oneTime = await provider.createPrice(getStepCtx("price-onetime"), {
        productId: STATE.productId,
        unitAmount: 5000, // $50.00
        currency: "usd",
        active: true,
      });
      if (oneTime.data) STATE.priceId = oneTime.data;

      // Recurring price
      const recurring = await provider.createPrice(
        getStepCtx("price-recurring"),
        {
          productId: STATE.productId,
          unitAmount: 2000, // $20.00
          currency: "usd",
          interval: "month",
          intervalCount: 1,
          active: true,
        },
      );
      if (recurring.data) STATE.recurringPriceId = recurring.data;

      return recurring;
    },

    createCoupon: async (c) => {
      const res = await provider.createCoupon(getStepCtx("create-coupon"), {
        code: `SMOKE20_${Date.now()}`,
        percentOff: 20,
        duration: "once",
      });
      if (res.data) STATE.couponId = res.data;
      return res;
    },

    // ─── CUSTOMER & INVOICING ─────────────────────────────────────────────────

    createCustomer: async (c) => {
      const res = await provider.createCustomer(getStepCtx("create-cust"), {
        email: `smoke-${Date.now()}@revstack.dev`,
        name: "Smoke Automator",
        metadata: { smoke: "true", traceId: ctx.traceId },
      });
      if (res.data) STATE.customerId = res.data;
      return res;
    },

    addInvoiceItem: async (c) => {
      if (!STATE.customerId) throw new Error("No customerId");
      return await provider.addInvoiceItem(getStepCtx("add-inv-item"), {
        customerId: STATE.customerId,
        amount: 1500, // $15.00
        currency: "usd",
        description: "One-time setup fee",
      });
    },

    createInvoice: async (c) => {
      if (!STATE.customerId) throw new Error("No customerId");
      return await provider.createInvoice(getStepCtx("inv-create"), {
        customerId: STATE.customerId,
        autoAdvance: false,
        collectionMethod: "manual",
        daysUntilDue: 7,
      });
    },

    // ─── CHECKOUT WITH DISCOUNTS ──────────────────────────────────────────────

    createPayment: async (c) => {
      if (!STATE.customerId || !STATE.priceId) throw new Error("Missing deps.");

      return await provider.createPayment(getStepCtx("checkout-pay"), {
        customerId: STATE.customerId,
        successUrl: FIXTURES.returnUrl,
        cancelUrl: FIXTURES.returnUrl,
        promotionCodeId: STATE.couponId,
        allowPromotionCodes: false,
        lineItems: [{ priceId: STATE.priceId, quantity: 1 }],
      });
    },

    createSubscription: async (c) => {
      if (!STATE.customerId || !STATE.recurringPriceId)
        throw new Error("Missing deps.");

      const res = await provider.createSubscription(
        getStepCtx("checkout-sub"),
        {
          customerId: STATE.customerId,
          successUrl: FIXTURES.returnUrl,
          cancelUrl: FIXTURES.returnUrl,
          promotionCodeId: STATE.couponId,
          lineItems: [{ priceId: STATE.recurringPriceId, quantity: 1 }],
        },
      );

      const shadowSub = await stripe.subscriptions.create({
        customer: STATE.customerId,
        items: [{ price: STATE.recurringPriceId }],
        payment_behavior: "default_incomplete",
      });
      STATE.subscriptionId = shadowSub.id;

      return res;
    },

    // ─── CLEANUP ──────────────────────────────────────────────────────────────

    deleteCustomer: async (c) => {
      if (!STATE.customerId) return { status: "success" };
      return await provider.deleteCustomer(getStepCtx("del-cust"), {
        id: STATE.customerId,
      });
    },

    onUninstall: async (c) => {
      if (!STATE.webhookEndpointId) return { status: "success" };
      return await provider.onUninstall(getStepCtx("uninstall"), {
        config: c.config,
        data: { webhookEndpointId: STATE.webhookEndpointId },
      });
    },

    // ─── TIME-TRAVEL LIFECYCLE ────────────────────────────────────────────────
    // Run via: pnpm smoke stripe lifecycle
    // Requires STRIPE_PRICE_ID (a recurring monthly price) in .env.test

    lifecycle: async (c) => {
      const priceId = process.env.STRIPE_RECURRING_PRICE_ID;
      if (!priceId)
        throw new Error("STRIPE_RECURRING_PRICE_ID not set in .env.test");
      await runLifecycleScenario(c, priceId);
      return { status: "success" };
    },
  },
});
