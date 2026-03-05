/**
 * helper to build a query separator for URLs
 */
export function appendQueryParam(url: string, param: string): string {
  const sep = url.includes("?") ? "&" : "?";
  return url + sep + param;
}
