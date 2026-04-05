import { z } from "zod";
import type { AddonEntitlementRepository } from "@revstackhq/core";
import { AddonEntitlementNotFoundError } from "@revstackhq/core";

// Input DTO
export const GetAddonEntitlementQuerySchema = z.object({
  addon_id: z.string().min(1, "Addon ID is required"),
  entitlement_id: z.string().min(1, "Entitlement ID is required"),
});

export type GetAddonEntitlementQuery = z.infer<
  typeof GetAddonEntitlementQuerySchema
>;

// Output DTO
export const GetAddonEntitlementResponseSchema = z.object({
  id: z.string(),
  addon_id: z.string(),
  entitlement_id: z.string(),
  metadata: z.record(z.any()).optional(),
  created_at: z.date(),
  updated_at: z.date(),
});

export type GetAddonEntitlementResponse = z.infer<
  typeof GetAddonEntitlementResponseSchema
>;

export class GetAddonEntitlementHandler {
  constructor(private readonly repository: AddonEntitlementRepository) {}

  public async execute(
    query: GetAddonEntitlementQuery,
  ): Promise<GetAddonEntitlementResponse> {
    const entity = await this.repository.findByAddonAndEntitlement(
      query.addon_id,
      query.entitlement_id,
    );

    if (!entity) {
      throw new AddonEntitlementNotFoundError();
    }

    const v = entity.val;
    return {
      id: v.id!,
      addon_id: v.addonId,
      entitlement_id: v.entitlementId,
      metadata: v.metadata,
      created_at: v.createdAt,
      updated_at: v.updatedAt,
    };
  }
}
