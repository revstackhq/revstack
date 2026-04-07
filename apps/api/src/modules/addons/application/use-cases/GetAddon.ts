import { z } from "zod";
import { AddonNotFoundError, AddonRepository } from "@revstackhq/core";

export const GetAddonQuerySchema = z.object({
  environment_id: z.string().min(1),
  id_or_slug: z.string().min(1),
});

export type GetAddonQuery = z.infer<typeof GetAddonQuerySchema>;

export const GetAddonResponseSchema = z.object({
  id: z.string(),
  environment_id: z.string(),
  slug: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  type: z.string(),
  billing_interval: z.string().nullable(),
  billing_interval_count: z.number().nullable(),
  amount: z.number(),
  currency: z.string(),
  status: z.string(),
  metadata: z.record(z.any()),
  entitlements: z.array(
    z.object({
      id: z.string(),
      entitlement_id: z.string(),
      value_limit: z.number().nullable(),
      type: z.enum(["increment", "set"]),
    }),
  ),
  created_at: z.date(),
  updated_at: z.date(),
});

export type GetAddonResponse = z.infer<typeof GetAddonResponseSchema>;

export class GetAddonHandler {
  constructor(private readonly repository: AddonRepository) {}

  public async execute(query: GetAddonQuery): Promise<GetAddonResponse> {
    let addon = await this.repository.findById({
      environmentId: query.environment_id,
      id: query.id_or_slug,
    });

    if (!addon) {
      addon = await this.repository.findBySlug({
        environmentId: query.environment_id,
        slug: query.id_or_slug,
      });
    }

    if (!addon) {
      throw new AddonNotFoundError();
    }

    const v = addon.val;

    return {
      id: v.id,
      environment_id: v.environmentId,
      slug: v.slug,
      name: v.name,
      description: v.description ?? null,
      type: v.type,
      billing_interval: v.billingInterval ?? null,
      billing_interval_count: v.billingIntervalCount ?? null,
      amount: v.amount,
      currency: v.currency,
      status: v.status,
      metadata: v.metadata,
      entitlements: v.entitlements.map((e) => ({
        id: e.id,
        entitlement_id: e.entitlementId,
        value_limit: e.valueLimit ?? null,
        type: e.type,
      })),
      created_at: v.createdAt,
      updated_at: v.updatedAt,
    };
  }
}
