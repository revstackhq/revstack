import { z } from "zod";

export const recordUsageSchema = z.object({
  customerId: z.string().min(1, "Customer ID is required"),
  featureId: z.string().min(1, "Feature ID is required"),
  amount: z.number().positive("Amount must be positive"),
});

export type RecordUsageCommand = z.infer<typeof recordUsageSchema>;
