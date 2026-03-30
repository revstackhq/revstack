import { z } from "zod";

export const CreateCreditNoteCommandSchema = z.object({
  invoice_id: z.string().min(1),
  amount: z.number().positive(),
  reason: z.string().optional(),
});

export type CreateCreditNoteCommand = z.infer<typeof CreateCreditNoteCommandSchema>;

export const CreateCreditNoteResponseSchema = z.object({
  id: z.string(),
});

export type CreateCreditNoteResponse = z.infer<typeof CreateCreditNoteResponseSchema>;
