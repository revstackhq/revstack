import Stripe from "stripe";

const STRIPE_API_VERSION: Stripe.LatestApiVersion = "2026-01-28.clover";

// cache stripe instances per api key
const clients = new Map<string, Stripe>();

export function getOrCreateClient(apiKey: string): Stripe {
  let client = clients.get(apiKey);
  if (!client) {
    client = new Stripe(apiKey, {
      apiVersion: STRIPE_API_VERSION,
      typescript: true,
    });
    clients.set(apiKey, client);
  }
  return client;
}

/**
 * helper to build a query separator for URLs
 */
export function appendQueryParam(url: string, param: string): string {
  const sep = url.includes("?") ? "&" : "?";
  return url + sep + param;
}
