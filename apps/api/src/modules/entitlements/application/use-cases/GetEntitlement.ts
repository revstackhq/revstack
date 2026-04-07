import { z } from "zod";
import type { EntitlementRepository } from "@revstackhq/core";

export const GetEntitlementQuerySchema = z.object({
  id: z.string().min(1),
  environment_id: z.string().min(1),
});

export type GetEntitlementQuery = z.infer<typeof GetEntitlementQuerySchema>;

export const GetEntitlementResponseSchema = z
  .object({
    id: z.string(),
    environment_id: z.string(),
    slug: z.string(),
    name: z.string(),
    description: z.string().optional(),
    type: z.string(),
    unit_type: z.string(),
    status: z.string(),
    metadata: z.record(z.unknown()),
    created_at: z.date(),
    updated_at: z.date(),
  })
  .nullable();

export type GetEntitlementResponse = z.infer<
  typeof GetEntitlementResponseSchema
>;

export class GetEntitlementHandler {
  constructor(private readonly repository: EntitlementRepository) {}

  public async execute(
    query: GetEntitlementQuery,
  ): Promise<GetEntitlementResponse> {
    const entitlement = await this.repository.findById({
      id: query.id,
      environmentId: query.environment_id,
    });

    if (!entitlement) {
      return null;
    }

    const v = entitlement.val;

    return {
      id: v.id,
      environment_id: v.environmentId,
      slug: v.slug,
      name: v.name,
      description: v.description,
      type: v.type,
      unit_type: v.unitType,
      status: v.status,
      metadata: v.metadata ?? {},
      created_at: v.createdAt,
      updated_at: v.updatedAt,
    };
  }
}
