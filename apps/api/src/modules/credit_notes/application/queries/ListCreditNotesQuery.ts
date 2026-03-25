import { z } from "zod";

export const listCreditNotesSchema = z.object({
  invoiceId: z.string().optional(),
  status: z.enum(["issued", "void"]).optional(),
});

export type ListCreditNotesQuery = z.infer<typeof listCreditNotesSchema>;
