import { z } from "zod";

export const ListCustomersQuerySchema = z.object({
  environment_id: z.string().min(1, "Environment is required"),
  limit: z.number().optional().default(10),
  offset: z.number().optional().default(0),
});

export type ListCustomersQuery = z.infer<typeof ListCustomersQuerySchema>;

export const CustomerResponseSchema = z.object({
  id: z.string(),
  environment_id: z.string(),
  user_id: z.string(),
  email: z.string().email(),
  name: z.string(),
  external_id: z.string(),
  phone: z.string().nullable(),
  metadata: z.record(z.any()).nullable(),
  created_at: z.date(),
});

export const ListCustomersResponseSchema = z.array(CustomerResponseSchema);

export type ListCustomersResponse = z.infer<typeof ListCustomersResponseSchema>;
