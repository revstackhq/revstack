import { z } from "zod";

export const updateInvoiceSchema = z.object({
  dueDate: z.string().datetime().optional(),
  status: z.enum(["draft", "open", "paid", "void", "uncollectible"]).optional(),
});

export type UpdateInvoiceCommand = {
  id: string;
} & z.infer<typeof updateInvoiceSchema>;
