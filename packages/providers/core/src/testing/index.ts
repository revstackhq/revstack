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
export { createComplianceSuite } from "@/testing/suite";
export type {
  ComplianceSuiteOptions,
  WebhookFixtureMap,
  SignatureTestInput,
  ProrationScenario,
} from "@/testing/suite";

// Domain assertion helpers
export {
  assertCustomerShape,
  assertSubscriptionShape,
  assertInvoiceShape,
  assertProductShape,
  assertPriceShape,
} from "@/testing/assertions";

// Certification report generator
export { generateCertificationReport } from "@/testing/report";
export type { CertificationReport } from "@/testing/report";
export * from "@/smoke-runner";
