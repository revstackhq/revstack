import { z } from "zod";

export const listPaymentsSchema = z.object({
  invoiceId: z.string().optional(),
  status: z.enum(["pending", "succeeded", "failed", "refunded"]).optional(),
});

export type ListPaymentsQuery = z.infer<typeof listPaymentsSchema>;
