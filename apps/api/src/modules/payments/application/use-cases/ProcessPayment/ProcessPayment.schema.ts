import { z } from "zod";

export const processPaymentSchema = z.object({
  invoiceId: z.string().min(1, "Invoice ID is required"),
  amount: z.number().positive("Amount must be positive"),
  method: z.string().min(1, "Payment method is required"),
  idempotencyKey: z.string().optional(),
});

export type ProcessPaymentCommand = z.infer<typeof processPaymentSchema>;
