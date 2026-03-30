import { z } from "zod";

export const ListCreditNotesQuerySchema = z.object({
  invoice_id: z.string().optional(),
  status: z.enum(["issued", "void"]).optional(),
});

export type ListCreditNotesQuery = z.infer<typeof ListCreditNotesQuerySchema>;
