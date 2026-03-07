import { StripeProvider } from "@/provider";
import { ProviderContext, runSmoke } from "@revstackhq/providers-core";
import Stripe from "stripe";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env.test") });

const loadWebhookMock = (fileName: string) => {
  const filePath = path.resolve(
    __dirname,
    `../src/mocks/webhooks/${fileName}.json`,
  );

  console.log(filePath);
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
};

// ─── CONFIGURATION ────────────────────────────────────────────────────────────

const STRIPE_API_VERSION = "2026-02-25.clover";

const provider = new StripeProvider();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: STRIPE_API_VERSION,
});

const STATE = {
  customerId: "",
  subscriptionId: "",
  paymentId: "",
  priceId: "",
  webhookEndpointId: process.env.STRIPE_WEBHOOK_ENDPOINT_ID || "",
};

const FIXTURES = {
  priceId: process.env.STRIPE_PRICE_ID!,
  webhookUrl: process.env.STRIPE_WEBHOOK_URL || "https://example.com/webhook",
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "whsec_test",
  returnUrl: "https://example.com/return",
};

const ctx: ProviderContext = {
  isTestMode: true,
  traceId: `smoke-${Date.now()}`,
  config: { apiKey: process.env.STRIPE_SECRET_KEY! },
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
  scenarios: {
    bootstrap: async () => {
      if (!STATE.priceId) {
        console.log(
          "🛠️  Bootstrap: No Price ID found, creating temporary product/price...",
        );

        const product = await stripe.products.create({
          name: "Smoke Test Product",
        });

        const price = await stripe.prices.create({
          product: product.id,
          unit_amount: 2000,
          currency: "usd",
          recurring: { interval: "month" },
        });
        STATE.priceId = price.id;
        console.log(`✅ Bootstrap: Created Price ${STATE.priceId}`);
      }
      return { priceId: STATE.priceId };
    },
    // ─── SETUP & WEBHOOKS ─────────────────────────────────────────────────────

    onInstall: async (c) => {
      const res = await provider.onInstall(getStepCtx("install"), {
        webhookUrl: FIXTURES.webhookUrl,
        config: c.config,
      });
      if (res.data?.data?.webhookEndpointId) {
        STATE.webhookEndpointId = res.data.data.webhookEndpointId as string;
      }
      return res;
    },

    verifyWebhookSignature: async (c) => {
      return await provider.verifyWebhookSignature(
        c,
        JSON.stringify({ id: "evt_test", type: "payment_intent.succeeded" }),
        { "stripe-signature": `t=${Math.floor(Date.now() / 1000)},v1=bad_sig` },
        FIXTURES.webhookSecret,
      );
    },

    parseWebhookEvent: async (c) => {
      const mockEvent = loadWebhookMock("subscription_updated");

      mockEvent.data.object.customer = STATE.customerId;
      mockEvent.data.object.id = STATE.subscriptionId;

      return await provider.parseWebhookEvent(c, mockEvent);
    },

    // ─── CUSTOMER LIFECYCLE ───────────────────────────────────────────────────

    createCustomer: async (c) => {
      const res = await provider.createCustomer(getStepCtx("create-cust"), {
        email: `smoke-${Date.now()}@revstack.dev`,
        name: "Smoke Automator",
        metadata: { smoke: "true", traceId: ctx.traceId },
      });
      if (res.data) STATE.customerId = res.data;
      return res;
    },

    getCustomer: async (c) => {
      if (!STATE.customerId) throw new Error("Skipping: No customerId.");
      return await provider.getCustomer(c, { id: STATE.customerId });
    },

    updateCustomer: async (c) => {
      if (!STATE.customerId) throw new Error("Skipping: No customerId.");
      return await provider.updateCustomer(getStepCtx("upd-cust"), {
        id: STATE.customerId,
        name: "Smoke Automator Updated",
      });
    },

    // ─── PAYMENTS (Checkout + Shadow Intent) ──────────────────────────────────

    createPayment: async (c) => {
      if (!STATE.customerId) throw new Error("Skipping: No customerId.");

      const res = await provider.createPayment(getStepCtx("checkout-pay"), {
        customerId: STATE.customerId,
        successUrl: FIXTURES.returnUrl,
        cancelUrl: FIXTURES.returnUrl,
        lineItems: [
          { name: "Credits", amount: 1000, currency: "USD", quantity: 1 },
        ],
      });

      const intent = await stripe.paymentIntents.create({
        amount: 1000,
        currency: "usd",
        customer: STATE.customerId,
      });
      STATE.paymentId = intent.id;
      return res;
    },

    getPayment: async (c) => {
      if (!STATE.paymentId) throw new Error("No paymentId.");
      return await provider.getPayment(c, { id: STATE.paymentId });
    },

    // ─── SUBSCRIPTIONS (Checkout + Shadow Sub) ────────────────────────────────

    createSubscription: async (c) => {
      if (!STATE.customerId || !STATE.priceId)
        throw new Error("Missing dependencies.");

      const res = await provider.createSubscription(
        getStepCtx("checkout-sub"),
        {
          customerId: STATE.customerId,
          successUrl: FIXTURES.returnUrl,
          cancelUrl: FIXTURES.returnUrl,
          lineItems: [{ priceId: STATE.priceId, quantity: 1 }],
        },
      );

      const shadowSub = await stripe.subscriptions.create({
        customer: STATE.customerId,
        items: [{ price: STATE.priceId }],
        payment_behavior: "default_incomplete",
      });
      STATE.subscriptionId = shadowSub.id;

      return res;
    },

    getSubscription: async (c) => {
      if (!STATE.subscriptionId) throw new Error("No subscriptionId.");
      return await provider.getSubscription(c, { id: STATE.subscriptionId });
    },

    pauseSubscription: async (c) => {
      if (!STATE.subscriptionId) throw new Error("Skipping: No subscription.");
      return await provider.pauseSubscription(getStepCtx("pause-sub"), {
        id: STATE.subscriptionId,
      });
    },

    resumeSubscription: async (c) => {
      if (!STATE.subscriptionId) throw new Error("Skipping: No subscription.");
      return await provider.resumeSubscription(getStepCtx("resume-sub"), {
        id: STATE.subscriptionId,
      });
    },

    cancelSubscription: async (c) => {
      if (!STATE.subscriptionId) throw new Error("No subscription.");
      return await provider.cancelSubscription(getStepCtx("cancel-sub"), {
        id: STATE.subscriptionId,
      });
    },

    // ─── CLEANUP ──────────────────────────────────────────────────────────────

    deleteCustomer: async (c) => {
      if (!STATE.customerId) return { success: true };
      return await provider.deleteCustomer(getStepCtx("del-cust"), {
        id: STATE.customerId,
      });
    },

    onUninstall: async (c) => {
      if (!STATE.webhookEndpointId) return { success: true };
      return await provider.onUninstall(c, {
        config: c.config,
        data: { webhookEndpointId: STATE.webhookEndpointId },
      });
    },
  },
});
