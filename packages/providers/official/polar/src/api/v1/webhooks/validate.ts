import { ProviderContext, AsyncActionResult } from "@revstackhq/providers-core";
import { getOrCreateClient } from "@/api/v1/client";

/**
 * Validates the provided Polar API credentials by checking the default organization list.
 *
 * @param ctx - The provider context.
 * @returns A boolean indicating if the credentials are valid.
 */
export const validateCredentials = async (
  ctx: ProviderContext,
): Promise<AsyncActionResult<boolean>> => {
  if (!ctx.config.accessToken || !ctx.config.organizationId) {
    return { data: false, status: "success" };
  }

  try {
    const polar = getOrCreateClient(ctx);
    await polar.organizations.list({});
    return { data: true, status: "success" };
  } catch {
    return { data: false, status: "failed" };
  }
};
