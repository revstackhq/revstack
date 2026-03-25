import { z } from "zod";

export const customerBaseSchema = z.object({
  environmentId: z.string().min(1, "Environment is required"),
  userId: z.string().min(1, "User ID is required"),
  providerId: z.string().min(1, "Provider ID is required"),
  externalId: z.string().min(1, "External ID is required"),
  email: z.string().email("Invalid email"),
  name: z.string().min(1, "Name is required"),
  phone: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export const createManyCustomersSchema = z.object({
  customers: z.array(customerBaseSchema).min(1, "At least one customer is required"),
});

export type CreateManyCustomersCommand = z.infer<typeof createManyCustomersSchema>;
