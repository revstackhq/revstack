import type { AppEnv } from "@/container";
import { createMiddleware } from "hono/factory";

export const requireDashboardUser = createMiddleware<AppEnv>(
  async (c, next) => {
    if (c.get("authType") !== "jwt") {
      return c.json(
        {
          error: "Forbidden",
          message: "This action requires a Dashboard session",
        },
        403,
      );
    }

    await next();
  },
);
