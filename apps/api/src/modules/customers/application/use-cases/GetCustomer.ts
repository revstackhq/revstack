import { z } from "zod";
import {
  CustomerNotFoundError,
  type CustomerRepository,
} from "@revstackhq/core";
import { CustomerItemSchema } from "./CreateCustomer";

export const GetCustomerQuerySchema = z.object({
  id: z.string().min(1),
  environment_id: z.string().min(1),
});

export type GetCustomerQuery = z.infer<typeof GetCustomerQuerySchema>;

export const GetCustomerResponseSchema = CustomerItemSchema.nullable();

export type GetCustomerResponse = z.infer<typeof GetCustomerResponseSchema>;

export class GetCustomerHandler {
  constructor(private readonly repository: CustomerRepository) {}

  public async execute(query: GetCustomerQuery): Promise<GetCustomerResponse> {
    const customer = await this.repository.findById({
      id: query.id,
      environmentId: query.environment_id,
    });

    if (!customer) {
      throw new CustomerNotFoundError(query.id);
    }

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
      billing_address: v.billingAddress as Record<string, any>,
      tax_ids: v.taxIds as any[],
      status: v.status,
      metadata: v.metadata ?? {},
      created_at: v.createdAt,
      updated_at: v.updatedAt,
    };
  }
}
