import { z } from "zod";

export const debitWalletSchema = z.object({
  amount: z.number().positive(),
  referenceId: z.string().optional(),
});

export type DebitWalletCommand = {
  walletId: string;
} & z.infer<typeof debitWalletSchema>;
