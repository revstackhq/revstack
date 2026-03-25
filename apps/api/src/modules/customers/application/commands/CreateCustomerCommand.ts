import { z } from "zod";

export const createCustomerSchema = z.object({
  environmentId: z.string(),
  userId: z.string(),
  providerId: z.string(),
  externalId: z.string(),
  email: z.string().email(),
  name: z.string().min(1),
  phone: z.string().optional(),
});

export type CreateCustomerCommand = z.infer<typeof createCustomerSchema>;
