import { z } from "zod";

// Input DTO
export const DeleteAddonEntitlementCommandSchema = z.object({
  addon_id: z.string().min(1, "Addon ID is required"),
  entitlement_id: z.string().min(1, "Entitlement ID is required"),
});

export type DeleteAddonEntitlementCommand = z.infer<
  typeof DeleteAddonEntitlementCommandSchema
>;

// Output DTO
export const DeleteAddonEntitlementResponseSchema = z.object({
  success: z.boolean(),
});

export type DeleteAddonEntitlementResponse = z.infer<
  typeof DeleteAddonEntitlementResponseSchema
>;
