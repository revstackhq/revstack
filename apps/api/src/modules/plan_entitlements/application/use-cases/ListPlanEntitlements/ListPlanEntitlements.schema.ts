import { z } from "zod";

export const listPlanEntitlementsSchema = z.object({
  planId: z.string().min(1, "Plan ID is required"),
});

export type ListPlanEntitlementsQuery = z.infer<typeof listPlanEntitlementsSchema>;
