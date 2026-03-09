/**
 * @revstackhq/providers-core/testing
 *
 * The Revstack Technology Compatibility Kit (TCK).
 * A generic, provider-agnostic compliance testing engine.
 *
 * Import from this entry point in your provider's test files:
 * @example
 * import {
 *   createComplianceSuite,
 *   assertCustomerShape,
 * } from "@revstackhq/providers-core/testing";
 *
 * // Your provider package defines and injects its own fixtures:
 * import { STRIPE_FIXTURES, stripeSignatureTest } from "@revstackhq/provider-stripe/testing";
 *
 * createComplianceSuite(new StripeProvider(), ctx, {
 *   customer: true,
 *   webhooks: true,
 *   fixtures: STRIPE_FIXTURES,
 *   signatureTestInput: stripeSignatureTest,
 * });
 */

// Suite factory + option types
export { createComplianceSuite } from "./suite";
export type {
  ComplianceSuiteOptions,
  WebhookFixtureMap,
  SignatureTestInput,
  ProrationScenario,
} from "./suite";

// Domain assertion helpers
export {
  assertCustomerShape,
  assertSubscriptionShape,
  assertInvoiceShape,
  assertProductShape,
  assertPriceShape,
} from "./assertions";

// Certification report generator
export { generateCertificationReport } from "./report";
export type { CertificationReport } from "./report";
