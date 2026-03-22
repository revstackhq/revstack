import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { buildContainer, type AppEnv } from "@/container";

// Import Routers
import { entitlementsRoutes } from "@/modules/entitlements/infrastructure/http/entitlements.routes";
import { plansRoutes } from "@/modules/plans/infrastructure/http/plans.routes";
import { customersRoutes } from "@/modules/customers/infrastructure/http/customers.routes";
import { subscriptionsRoutes } from "@/modules/subscriptions/infrastructure/http/subscriptions.routes";
import { usageRoutes } from "@/modules/usage/infrastructure/http/usage.routes";
import { walletsRoutes } from "@/modules/wallets/infrastructure/http/wallets.routes";
import { invoicesRoutes } from "@/modules/invoices/infrastructure/http/invoices.routes";
import { paymentsRoutes } from "@/modules/invoices/infrastructure/http/payments.routes";
import { webhooksRoutes } from "@/modules/webhooks/infrastructure/http/webhooks.routes";
import { systemRoutes } from "@/modules/system/infrastructure/http/system.routes";
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

// 3. Mount Routes (Presentation Layer)
const routes = app
  .route("/v1/entitlements", entitlementsRoutes)
  .route("/v1/plans", plansRoutes)
  .route("/v1/customers", customersRoutes)
  .route("/v1/subscriptions", subscriptionsRoutes)
  .route("/v1/usage", usageRoutes)
  .route("/v1/wallets", walletsRoutes)
  .route("/v1/invoices", invoicesRoutes)
  .route("/v1/payments", paymentsRoutes)
  .route("/v1/webhooks", webhooksRoutes)
  .route("/v1/system", systemRoutes);

export type AppRouter = typeof routes;

app.get("/health", (c) => c.json({ status: "healthy" }));

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

console.log(`Running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
