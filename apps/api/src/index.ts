import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { buildContainer, type AppEnv } from "@/container";

import { addonEntitlementsRoutes } from "@/modules/addon_entitlements/infrastructure/http/addon_entitlements.routes";
import { addonsRoutes } from "@/modules/addons/infrastructure/http/addons.routes";
import { auditRoutes } from "@/modules/audit/infrastructure/http/audit.routes";
import { authRoutes } from "@/modules/auth/infrastructure/http/auth.routes";
import { couponsRoutes } from "@/modules/coupons/infrastructure/http/coupons.routes";
import { creditNotesRoutes } from "@/modules/credit_notes/infrastructure/http/credit_notes.routes";
import { customersRoutes } from "@/modules/customers/infrastructure/http/customers.routes";
import { entitlementsRoutes } from "@/modules/entitlements/infrastructure/http/entitlements.routes";
import { environmentsRoutes } from "@/modules/environments/infrastructure/http/environments.routes";
import { integrationsRoutes } from "@/modules/integrations/infrastructure/http/integrations.routes";
import { invoicesRoutes } from "@/modules/invoices/infrastructure/http/invoices.routes";
import { paymentsRoutes } from "@/modules/payments/infrastructure/http/payments.routes";
import { planEntitlementsRoutes } from "@/modules/plan_entitlements/infrastructure/http/plan_entitlements.routes";
import { plansRoutes } from "@/modules/plans/infrastructure/http/plans.routes";
import { pricesRoutes } from "@/modules/prices/infrastructure/http/prices.routes";
import { providerEventsRoutes } from "@/modules/provider_events/infrastructure/http/provider_events.routes";
import { refundsRoutes } from "@/modules/refunds/infrastructure/http/refunds.routes";
import { studioRoutes } from "@/modules/studio/infrastructure/http/studio.routes";
import { subscriptionsRoutes } from "@/modules/subscriptions/infrastructure/http/subscriptions.routes";
import { systemRoutes } from "@/modules/system/infrastructure/http/system.routes";
import { usageRoutes } from "@/modules/usage/infrastructure/http/usage.routes";
import { usersRoutes } from "@/modules/users/infrastructure/http/users.routes";
import { walletsRoutes } from "@/modules/wallets/infrastructure/http/wallets.routes";
import { webhooksRoutes } from "@/modules/webhooks/infrastructure/http/webhooks.routes";
import { globalErrorHandler } from "@/common/middlewares/errorHandler";

const app = new Hono<AppEnv>();

// Global Error Handler
app.onError(globalErrorHandler);

// 1. Build Dependency Injection Container
const container = buildContainer();

// 2. Middleware to inject services into Request Context
app.use("*", async (c, next) => {
  // Inject all handlers into the context
  for (const [key, value] of Object.entries(container)) {
    c.set(key as keyof typeof container, value);
  }
  await next();
});

const routes = app
  .route("/v1/addon-entitlements", addonEntitlementsRoutes)
  .route("/v1/addons", addonsRoutes)
  .route("/v1/audit", auditRoutes)
  .route("/v1/auth", authRoutes)
  .route("/v1/coupons", couponsRoutes)
  .route("/v1/credit-notes", creditNotesRoutes)
  .route("/v1/customers", customersRoutes)
  .route("/v1/entitlements", entitlementsRoutes)
  .route("/v1/environments", environmentsRoutes)
  .route("/v1/integrations", integrationsRoutes)
  .route("/v1/invoices", invoicesRoutes)
  .route("/v1/payments", paymentsRoutes)
  .route("/v1/plan-entitlements", planEntitlementsRoutes)
  .route("/v1/plans", plansRoutes)
  .route("/v1/prices", pricesRoutes)
  .route("/v1/provider-events", providerEventsRoutes)
  .route("/v1/refunds", refundsRoutes)
  .route("/v1/studio", studioRoutes)
  .route("/v1/subscriptions", subscriptionsRoutes)
  .route("/v1/system", systemRoutes)
  .route("/v1/usage", usageRoutes)
  .route("/v1/users", usersRoutes)
  .route("/v1/wallets", walletsRoutes)
  .route("/v1/webhooks", webhooksRoutes);

export type AppRouter = typeof routes;

app.get("/health", (c) => c.json({ status: "healthy" }));

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

console.log(`Running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
