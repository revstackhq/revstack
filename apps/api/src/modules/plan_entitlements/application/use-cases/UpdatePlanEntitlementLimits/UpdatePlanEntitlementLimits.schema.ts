import { z } from "zod";

export const updatePlanEntitlementLimitsSchema = z.object({
  limit: z.number().int().min(0).optional(),
});

export type UpdatePlanEntitlementLimitsCommand = {
  planId: string;
  entitlementId: string;
} & z.infer<typeof updatePlanEntitlementLimitsSchema>;
