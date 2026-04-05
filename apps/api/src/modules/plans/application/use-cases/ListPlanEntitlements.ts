import { z } from "zod";
import type { PlanEntitlementRepository } from "@revstackhq/core";

export const listPlanEntitlementsSchema = z.object({
  planId: z.string().min(1, "Plan ID is required"),
});

export type ListPlanEntitlementsQuery = z.infer<typeof listPlanEntitlementsSchema>;

export class ListPlanEntitlementsHandler {
  constructor(private readonly repository: PlanEntitlementRepository) {}

  public async execute(query: ListPlanEntitlementsQuery) {
    const planEntitlements = await this.repository.find({
      planId: query.planId,
    });
    return planEntitlements.map(pe => pe.val);
  }
}
