import { z } from "zod";

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
