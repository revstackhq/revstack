import { ProviderClient } from "@/api/interface";
import { PolarClientV1 } from "@/api/v1";

export function getClient(_config: Record<string, unknown>): ProviderClient {
  return new PolarClientV1();
}
