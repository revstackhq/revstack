import { z } from "zod";

export const CreateCustomerCommandSchema = z.object({
  environment_id: z.string().min(1),
  user_id: z.string().min(1),
  provider_id: z.string().min(1),
  external_id: z.string().min(1),
  email: z.string().email(),
  name: z.string().min(1),
  phone: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export type CreateCustomerCommand = z.infer<typeof CreateCustomerCommandSchema>;

export const CreateCustomerResponseSchema = z.object({
  id: z.string(),
});

export type CreateCustomerResponse = z.infer<typeof CreateCustomerResponseSchema>;
