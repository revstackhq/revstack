import { z } from "zod";

export const listAddonEntitlementsSchema = z.object({
  addonId: z.string().min(1, "Addon ID is required"),
});

export type ListAddonEntitlementsQuery = z.infer<typeof listAddonEntitlementsSchema>;
