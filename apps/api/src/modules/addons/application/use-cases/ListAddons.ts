import { AddonRepository } from "@revstackhq/core";
import { z } from "zod";

export const ListAddonsQuerySchema = z.object({
  environment_id: z.string().min(1),
  cursor: z.string().optional(),
  limit: z.number().optional(),
  status: z.enum(["active", "inactive", "archived", "draft"]).optional(),
});

export type ListAddonsQuery = z.infer<typeof ListAddonsQuerySchema>;

export const ListAddonsResponseSchema = z.object({
  data: z.array(
    z.object({
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
      created_at: z.date(),
      updated_at: z.date(),
    }),
  ),
  pagination: z.object({
    next_cursor: z.string().nullable(),
    has_more: z.boolean(),
  }),
});

export type ListAddonsResponse = z.infer<typeof ListAddonsResponseSchema>;

export class ListAddonsHandler {
  constructor(private readonly repository: AddonRepository) {}

  public async execute(query: ListAddonsQuery): Promise<ListAddonsResponse> {
    const result = await this.repository.list({
      environmentId: query.environment_id,
      cursor: query.cursor,
      limit: query.limit,
      status: query.status,
    });

    return {
      data: result.data.map((addon) => {
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
          created_at: v.createdAt,
          updated_at: v.updatedAt,
        };
      }),
      pagination: {
        next_cursor: result.pagination?.nextCursor || null,
        has_more: result.pagination?.hasMore || false,
      },
    };
  }
}
