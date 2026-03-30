import { z } from "zod";

const customerPayloadSchema = z.object({
  user_id: z.string().min(1),
  provider_id: z.string().min(1),
  external_id: z.string().min(1),
  email: z.string().email(),
  name: z.string().min(1),
  phone: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export const CreateManyCustomersCommandSchema = z.object({
  environment_id: z.string().min(1, "Environment is required"),
  customers: z
    .array(customerPayloadSchema)
    .min(1, "At least one customer is required"),
});

export type CreateManyCustomersCommand = z.infer<
  typeof CreateManyCustomersCommandSchema
>;

export const CreateManyCustomersResponseSchema = z.array(z.any());

export type CreateManyCustomersResponse = z.infer<
  typeof CreateManyCustomersResponseSchema
>;
