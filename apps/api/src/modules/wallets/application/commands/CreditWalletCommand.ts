import { z } from "zod";

export const creditWalletSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  referenceId: z.string().optional(),
});

export type CreditWalletCommand = {
  walletId: string;
} & z.infer<typeof creditWalletSchema>;
