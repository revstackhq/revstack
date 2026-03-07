import Stripe from "stripe";

const STRIPE_API_VERSION: Stripe.LatestApiVersion = "2026-02-25.clover";

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
