import { z } from "zod";

export const GetCreditNoteQuerySchema = z.object({
  id: z.string().min(1),
});

export type GetCreditNoteQuery = z.infer<typeof GetCreditNoteQuerySchema>;
