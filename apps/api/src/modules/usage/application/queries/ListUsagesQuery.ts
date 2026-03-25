import { z } from "zod";

export const listUsagesSchema = z.object({
  customerId: z.string().min(1, "Customer ID is required"),
  featureId: z.string().optional(),
});

export type ListUsagesQuery = z.infer<typeof listUsagesSchema>;
