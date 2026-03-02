import { Polar } from "@polar-sh/sdk";

let polarClient: Polar | null = null;

export const getOrCreatePolar = (
  accessToken: string,
  testMode: boolean = false,
): Polar => {
  if (!polarClient) {
    polarClient = new Polar({
      accessToken,
      server: testMode ? "sandbox" : "production",
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
