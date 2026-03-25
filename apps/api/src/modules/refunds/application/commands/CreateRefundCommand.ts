import { z } from "zod";

export const createRefundSchema = z.object({
  amount: z.number().positive(),
  reason: z.string().optional(),
  idempotencyKey: z.string().optional(),
});

export type CreateRefundCommand = {
  paymentId: string;
} & z.infer<typeof createRefundSchema>;
