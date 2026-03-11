import { Polar } from "@polar-sh/sdk";
import { ProviderContext } from "@revstackhq/providers-core";

let polarClient: Polar | null = null;

export const getOrCreateClient = (ctx: ProviderContext): Polar => {
  if (!polarClient) {
    polarClient = new Polar({
      accessToken: ctx.config.accessToken,
      server: ctx.isTestMode ? "sandbox" : "production",
    });
  }
  return polarClient;
};
