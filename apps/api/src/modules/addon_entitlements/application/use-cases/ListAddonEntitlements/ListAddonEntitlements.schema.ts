import { z } from "zod";

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
