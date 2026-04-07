import { z } from "zod";
import type { CustomerRepository } from "@revstackhq/core";
import { CustomerItemSchema } from "./CreateCustomer";

export const ListCustomersQuerySchema = z.object({
  environment_id: z.string().min(1),
  status: z.enum(["active", "archived"]).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  cursor: z.string().optional(),
});

export type ListCustomersQuery = z.infer<typeof ListCustomersQuerySchema>;

export const ListCustomersResponseSchema = z.object({
  data: z.array(CustomerItemSchema),
  pagination: z.object({
    next_cursor: z.string().nullable(),
    has_more: z.boolean(),
  }),
});

export type ListCustomersResponse = z.infer<typeof ListCustomersResponseSchema>;

export class ListCustomersHandler {
  constructor(private readonly repository: CustomerRepository) {}

  public async execute(
    query: ListCustomersQuery,
  ): Promise<ListCustomersResponse> {
    const result = await this.repository.list({
      environmentId: query.environment_id,
      status: query.status,
      limit: query.limit,
      cursor: query.cursor,
    });

    return {
      data: result.data.map((customer) => {
        const v = customer.val;

        return {
          id: v.id,
          environment_id: v.environmentId,
          user_id: v.userId,
          provider_id: v.providerId,
          external_id: v.externalId,
          email: v.email,
          name: v.name,
          phone: v.phone,
          currency: v.currency,
          billing_address: v.billingAddress,
          tax_ids: v.taxIds,
          status: v.status,
          metadata: v.metadata ?? {},
          created_at: v.createdAt,
          updated_at: v.updatedAt,
        };
      }),
      pagination: {
        next_cursor: result.pagination?.nextCursor ?? null,
        has_more: result.pagination?.hasMore ?? false,
      },
    };
  }
}
