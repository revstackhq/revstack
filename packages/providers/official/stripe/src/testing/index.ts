/**
 * Stripe-specific TCK testing fixtures and helpers.
 *
 * Import these in your Stripe provider test files and inject them
 * into `createComplianceSuite` from `@revstackhq/providers-core/testing`.
 *
 * @example
 * import { createComplianceSuite } from "@revstackhq/providers-core/testing";
 * import { STRIPE_WEBHOOK_FIXTURES, stripeSignatureTestInput } from "@revstackhq/provider-stripe/testing";
 *
 * createComplianceSuite(new StripeProvider(), ctx, {
 *   webhooks: true,
 *   fixtures: STRIPE_WEBHOOK_FIXTURES,
 *   signatureTestInput: stripeSignatureTestInput,
 * });
 */

import type {
  WebhookFixtureMap,
  SignatureTestInput,
} from "@revstackhq/providers-core/testing";

/**
 * The canonical library of Stripe-shaped webhook fixtures for the TCK.
 * Each entry contains the raw Stripe Event payload and the expected
 * Revstack canonical event type after `parseWebhookEvent` mapping.
 */
export const STRIPE_WEBHOOK_FIXTURES: WebhookFixtureMap = {
  INVOICE_PAID: {
    id: "evt_tck_invpaid",
    object: "event",
    api_version: "2026-02-25.clover",
    type: "invoice.paid",
    created: 1741478400,
    livemode: false,
    data: {
      object: {
        id: "in_tck_001",
        object: "invoice",
        customer: "cus_tck_001",
        status: "paid",
        currency: "usd",
        subtotal: 2000,
        tax: 0,
        total: 2000,
        amount_due: 2000,
        amount_paid: 2000,
        created: 1741478000,
        lines: { data: [] },
        status_transitions: { finalized_at: 1741478100, paid_at: 1741478400 },
      },
    },
  },
  INVOICE_CREATED: {
    id: "evt_tck_invcreated",
    object: "event",
    type: "invoice.created",
    created: 1741478000,
    livemode: false,
    data: {
      object: {
        id: "in_tck_002",
        object: "invoice",
        customer: "cus_tck_001",
        status: "draft",
        currency: "usd",
        subtotal: 2000,
        tax: 0,
        total: 2000,
        amount_due: 2000,
        amount_paid: 0,
        created: 1741478000,
        lines: { data: [] },
        status_transitions: {},
      },
    },
  },
  SUBSCRIPTION_CREATED: {
    id: "evt_tck_subcreated",
    object: "event",
    type: "customer.subscription.created",
    created: 1741478000,
    livemode: false,
    data: {
      object: {
        id: "sub_tck_001",
        object: "subscription",
        customer: "cus_tck_001",
        status: "active",
        currency: "usd",
        current_period_start: 1741478000,
        current_period_end: 1744156400,
        cancel_at_period_end: false,
        created: 1741478000,
        start_date: 1741478000,
        items: {
          data: [
            {
              id: "si_tck_001",
              price: { id: "price_tck_001", product: "prod_tck_001" },
              quantity: 1,
            },
          ],
        },
      },
    },
  },
  SUBSCRIPTION_REVOKED: {
    id: "evt_tck_subcanceled",
    object: "event",
    type: "customer.subscription.deleted",
    created: 1741564800,
    livemode: false,
    data: {
      object: {
        id: "sub_tck_001",
        object: "subscription",
        customer: "cus_tck_001",
        status: "canceled",
        currency: "usd",
        current_period_start: 1741478000,
        current_period_end: 1744156400,
        cancel_at_period_end: false,
        canceled_at: 1741564800,
        ended_at: 1741564800,
        created: 1741478000,
        start_date: 1741478000,
        items: {
          data: [
            {
              id: "si_tck_001",
              price: { id: "price_tck_001", product: "prod_tck_001" },
              quantity: 1,
            },
          ],
        },
      },
    },
  },
  SUBSCRIPTION_UPDATED: {
    id: "evt_tck_subupdated",
    object: "event",
    type: "customer.subscription.updated",
    created: 1741564800,
    livemode: false,
    data: {
      object: {
        id: "sub_tck_001",
        object: "subscription",
        customer: "cus_tck_001",
        status: "active",
        currency: "usd",
        current_period_start: 1741478000,
        current_period_end: 1744156400,
        cancel_at_period_end: false,
        created: 1741478000,
        start_date: 1741478000,
        items: {
          data: [
            {
              id: "si_tck_001",
              price: { id: "price_tck_002", product: "prod_tck_001" },
              quantity: 2,
            },
          ],
        },
      },
    },
  },
  PAYMENT_SUCCEEDED: {
    id: "evt_tck_pisucceeded",
    object: "event",
    type: "payment_intent.succeeded",
    created: 1741478400,
    livemode: false,
    data: {
      object: {
        id: "pi_tck_001",
        object: "payment_intent",
        customer: "cus_tck_001",
        status: "succeeded",
        amount: 2000,
        currency: "usd",
        created: 1741478200,
        payment_method: "pm_tck_001",
      },
    },
  },
  PAYMENT_FAILED: {
    id: "evt_tck_pifailed",
    object: "event",
    type: "payment_intent.payment_failed",
    created: 1741478400,
    livemode: false,
    data: {
      object: {
        id: "pi_tck_002",
        object: "payment_intent",
        customer: "cus_tck_001",
        status: "requires_payment_method",
        amount: 2000,
        currency: "usd",
        created: 1741478200,
        last_payment_error: {
          code: "card_declined",
          message: "Your card was declined.",
        },
      },
    },
  },
  CUSTOMER_CREATED: {
    id: "evt_tck_custcreated",
    object: "event",
    type: "customer.created",
    created: 1741478000,
    livemode: false,
    data: {
      object: {
        id: "cus_tck_001",
        object: "customer",
        email: "tck@revstack.test",
        name: "TCK Test Customer",
        created: 1741478000,
        metadata: {},
      },
    },
  },
  DISPUTE_CREATED: {
    id: "evt_tck_dispute",
    object: "event",
    type: "charge.dispute.created",
    created: 1741564800,
    livemode: false,
    data: {
      object: {
        id: "dp_tck_001",
        object: "dispute",
        charge: "ch_tck_001",
        amount: 2000,
        currency: "usd",
        status: "needs_response",
        reason: "fraudulent",
        created: 1741564800,
      },
    },
  },
};

/**
 * Stripe-specific signature security test input.
 * Uses a deliberately malformed signature that will always fail Stripe's
 * HMAC-SHA256 verification.
 */
export const stripeSignatureTestInput: SignatureTestInput = {
  rawPayload: JSON.stringify({ id: "evt_tck_fake", type: "invoice.paid" }),
  invalidSignature: `t=${Math.floor(Date.now() / 1000)},v1=000000000000000000000000000000000000000000000000000000000000000000`,
  signatureHeader: "stripe-signature",
  webhookSecret: "whsec_test_revstack_tck_invalid",
};
