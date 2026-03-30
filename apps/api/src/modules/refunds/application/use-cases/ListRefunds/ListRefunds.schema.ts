import { z } from "zod";

export const listRefundsSchema = z.object({
  paymentId: z.string().optional(),
  status: z.enum(["pending", "succeeded", "failed"]).optional(),
});

export type ListRefundsQuery = z.infer<typeof listRefundsSchema>;
