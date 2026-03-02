import { ProviderClient } from "@/api/interface";
import { StripeClientV1 } from "@/api/v1";

export function getClient(_config: Record<string, unknown>): ProviderClient {
  return new StripeClientV1();
}
