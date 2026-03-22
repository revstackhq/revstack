import { z } from "zod";

export const creditWalletSchema = z.object({
  customerId: z.string().min(1, "Customer ID is required"),
  amount: z.number().positive("Amount must be positive"),
  currency: z.string().length(3),
  description: z.string().optional(),
});

export type CreditWalletCommand = z.infer<typeof creditWalletSchema>;
