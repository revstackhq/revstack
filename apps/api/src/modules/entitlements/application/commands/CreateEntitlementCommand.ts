import { z } from "zod";

export const createEntitlementSchema = z.object({
  name: z.string().min(1, "Name is required"),
  featureId: z.string().min(1, "Feature ID is required"),
  type: z.enum(["boolean", "metered"]),
  limit: z.number().int().optional(),
});

export type CreateEntitlementCommand = z.infer<typeof createEntitlementSchema>;
