import { createComplianceSuite } from "@revstackhq/providers-core/testing";
import { ProviderContext } from "@revstackhq/providers-core";
import { StripeProvider } from "@/provider";
import { STRIPE_WEBHOOK_FIXTURES, stripeSignatureTestInput } from "@/testing";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env.test") });

const ctx: ProviderContext = {
  isTestMode: true,
  traceId: `tck-${Date.now()}`,
  config: {
    apiKey: process.env.STRIPE_SECRET_KEY!,
    useStripeTax: false,
  },
};

const provider = new StripeProvider();

createComplianceSuite(provider, ctx, {
  customer: true,
  catalog: true,
  webhooks: true,
  fixtures: STRIPE_WEBHOOK_FIXTURES,
  signatureTestInput: stripeSignatureTestInput,
});
