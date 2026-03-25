import { z } from "zod";

export const createAddonEntitlementSchema = z.object({
  entitlementId: z.string().min(1),
  metadata: z.record(z.any()).optional(),
});

export type CreateAddonEntitlementCommand = {
  addonId: string;
} & z.infer<typeof createAddonEntitlementSchema>;
