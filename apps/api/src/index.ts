import { OpenAPIHono } from "@hono/zod-openapi";
import { serve } from "@hono/node-server";
import { buildContainer, type AppEnv } from "@/container";
import { globalErrorHandler } from "@/common/middlewares/error-handler";
import { requireAuth } from "@/common/middlewares/require-auth";

// --- Module Routes ---
import { addonsRoutes } from "@/modules/addons/infrastructure/http";
import { apiKeysRoutes } from "@/modules/api_keys/infrastructure/http";
import { auditRoutes } from "@/modules/audit/infrastructure/http";
import { couponsRoutes } from "@/modules/coupons/infrastructure/http";
import { customersRoutes } from "@/modules/customers/infrastructure/http";
import { entitlementsRoutes } from "@/modules/entitlements/infrastructure/http";
import { environmentsRoutes } from "@/modules/environments/infrastructure/http";
import { identityProvidersRoutes } from "@/modules/identity_providers/infrastructure/http";
import { integrationsRoutes } from "@/modules/integrations/infrastructure/http";
import { invoicesRoutes } from "@/modules/invoices/infrastructure/http";
import { paymentsRoutes } from "@/modules/payments/infrastructure/http";
import { plansRoutes } from "@/modules/plans/infrastructure/http";
import { pricesRoutes } from "@/modules/prices/infrastructure/http";
import { providerEventsRoutes } from "@/modules/provider_events/infrastructure/http";
import { refundsRoutes } from "@/modules/refunds/infrastructure/http";
import { subscriptionsRoutes } from "@/modules/subscriptions/infrastructure/http";
import { usageRoutes } from "@/modules/usage/infrastructure/http";
import { usersRoutes } from "@/modules/users/infrastructure/http";
import { walletsRoutes } from "@/modules/wallets/infrastructure/http";
import { webhooksRoutes } from "@/modules/webhooks/infrastructure/http";
import { workspacesRoutes } from "@/modules/workspaces/infrastructure/http";

const app = new OpenAPIHono<AppEnv>();

// Global Error Handler
app.onError(globalErrorHandler);

// 1. Build Dependency Injection Container
const container = buildContainer();

// 2. Middleware to inject services into Request Context
app.use("*", async (c, next) => {
  for (const [key, value] of Object.entries(container)) {
    c.set(key as keyof typeof container, value);
  }
  await next();
});

// 2.5 Auth Middleware
app.use("/v1/*", requireAuth);

// 3. Mount Routes (RESTful)
const routes = app
  .route("/v1/addons", addonsRoutes)
  .route("/v1/api-keys", apiKeysRoutes)
  .route("/v1/audit", auditRoutes)
  .route("/v1/identity-providers", identityProvidersRoutes)
  .route("/v1/coupons", couponsRoutes)
  .route("/v1/customers", customersRoutes)
  .route("/v1/entitlements", entitlementsRoutes)
  .route("/v1/environments", environmentsRoutes)
  .route("/v1/integrations", integrationsRoutes)
  .route("/v1/invoices", invoicesRoutes)
  .route("/v1/payments", paymentsRoutes)
  .route("/v1/plans", plansRoutes)
  .route("/v1/prices", pricesRoutes)
  .route("/v1/provider-events", providerEventsRoutes)
  .route("/v1/refunds", refundsRoutes)
  .route("/v1/subscriptions", subscriptionsRoutes)
  .route("/v1/usage", usageRoutes)
  .route("/v1/users", usersRoutes)
  .route("/v1/wallets", walletsRoutes)
  .route("/v1/webhooks", webhooksRoutes)
  .route("/v1/workspaces", workspacesRoutes);

export type AppRouter = typeof routes;

app.get("/health", (c) => c.json({ status: "healthy" }));

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 6900;
const environment = process.env.NODE_ENV || "development";
const isRevstackCloud = process.env.REVSTACK_CLOUD === "true";
const appUrl = process.env.APP_URL || `http://localhost:${port}`;

const hostingEnvironment = isRevstackCloud
  ? "Revstack Cloud"
  : environment === "production"
    ? "Self-Hosted"
    : "Local Development";

app.doc("/openapi.json", {
  openapi: "3.0.0",
  info: {
    title: "Revstack API",
    version: "1.0.0",
    description:
      "Open Source Billing OS for Developers. The scalable, developer-first billing engine with subscriptions, invoicing, usage metering, and entitlements.",
  },
  servers: [
    {
      url: appUrl,
      description: `Revstack API (${hostingEnvironment})`,
    },
  ],
});

console.log(`🚀 Revstack API running on ${appUrl}`);
console.log(`🌍 Environment: ${environment} (${hostingEnvironment})`);

serve({
  fetch: app.fetch,
  port,
});
