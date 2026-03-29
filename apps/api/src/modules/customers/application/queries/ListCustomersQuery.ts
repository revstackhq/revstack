import { z } from "zod";

export const listCustomersQuerySchema = z.object({
  environmentId: z.string().min(1, "Environment is required"),
  limit: z.number().optional().default(10),
  offset: z.number().optional().default(0),
});

export type ListCustomersQuery = z.infer<typeof listCustomersQuerySchema>;
