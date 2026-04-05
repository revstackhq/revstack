import { z } from "zod";
import type { AddonEntitlementRepository } from "@revstackhq/core";

// Input DTO
export const ListAddonEntitlementsQuerySchema = z.object({
  addon_id: z.string().min(1, "Addon ID is required"),
});

export type ListAddonEntitlementsQuery = z.infer<
  typeof ListAddonEntitlementsQuerySchema
>;

// Output DTO
export const AddonEntitlementResponseSchema = z.object({
  id: z.string(),
  addon_id: z.string(),
  entitlement_id: z.string(),
  metadata: z.record(z.any()).optional(),
  created_at: z.date(),
  updated_at: z.date(),
});

export const ListAddonEntitlementsResponseSchema = z.array(
  AddonEntitlementResponseSchema,
);

export type ListAddonEntitlementsResponse = z.infer<
  typeof ListAddonEntitlementsResponseSchema
>;

export class ListAddonEntitlementsHandler {
  constructor(private readonly repository: AddonEntitlementRepository) {}

  public async execute(
    query: ListAddonEntitlementsQuery,
  ): Promise<ListAddonEntitlementsResponse> {
    const entities = await this.repository.find({
      addonId: query.addon_id,
    });

    return entities.map((e) => {
      const v = e.val;
      return {
        id: v.id!,
        addon_id: v.addonId,
        entitlement_id: v.entitlementId,
        metadata: v.metadata,
        created_at: v.createdAt,
        updated_at: v.updatedAt,
      };
    });
  }
}
