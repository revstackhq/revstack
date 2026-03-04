import { Polar } from "@polar-sh/sdk";
import { ProviderContext } from "@revstackhq/providers-core";

let polarClient: Polar | null = null;

export const getOrCreatePolar = (ctx: ProviderContext): Polar => {
  if (!polarClient) {
    polarClient = new Polar({
      accessToken: ctx.config.accessToken,
      server: ctx.isTestMode ? "sandbox" : "production",
    });
  }
  return polarClient;
};

/**
 * helper to build a query separator for URLs
 */
export function appendQueryParam(url: string, param: string): string {
  const sep = url.includes("?") ? "&" : "?";
  return url + sep + param;
}
