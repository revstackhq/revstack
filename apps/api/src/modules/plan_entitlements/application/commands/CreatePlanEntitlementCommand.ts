import { z } from "zod";

export const createPlanEntitlementSchema = z.object({
  entitlementId: z.string().min(1),
  limit: z.number().int().min(0).optional(),
});

export type CreatePlanEntitlementCommand = {
  planId: string;
} & z.infer<typeof createPlanEntitlementSchema>;
