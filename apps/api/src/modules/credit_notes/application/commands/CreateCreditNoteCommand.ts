import { z } from "zod";

export const createCreditNoteSchema = z.object({
  invoiceId: z.string().min(1),
  amount: z.number().positive(),
  reason: z.string().optional(),
});

export type CreateCreditNoteCommand = z.infer<typeof createCreditNoteSchema>;
