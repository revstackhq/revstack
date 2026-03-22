import { z } from "zod";

export const createCustomerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).optional(),
  providerId: z.string().optional(),
});

export type CreateCustomerCommand = z.infer<typeof createCustomerSchema>;
