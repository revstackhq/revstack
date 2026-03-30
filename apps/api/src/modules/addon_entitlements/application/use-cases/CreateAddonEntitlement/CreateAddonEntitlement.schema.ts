import { z } from "zod";

// Input DTO
export const CreateAddonEntitlementCommandSchema = z.object({
  addon_id: z.string().min(1, "Addon ID is required"),
  entitlement_id: z.string().min(1, "Entitlement ID is required"),
  metadata: z.record(z.any()).optional(),
});

export type CreateAddonEntitlementCommand = z.infer<
  typeof CreateAddonEntitlementCommandSchema
>;

// Output DTO
export const CreateAddonEntitlementResponseSchema = z.object({
  id: z.string(),
  addon_id: z.string(),
  entitlement_id: z.string(),
  metadata: z.record(z.any()).optional(),
  created_at: z.date(),
  updated_at: z.date(),
});

export type CreateAddonEntitlementResponse = z.infer<
  typeof CreateAddonEntitlementResponseSchema
>;
