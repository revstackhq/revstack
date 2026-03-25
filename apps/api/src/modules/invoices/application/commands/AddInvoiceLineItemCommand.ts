import { z } from "zod";

export const addInvoiceLineItemSchema = z.object({
  name: z.string().min(1),
  periodStart: z.string().datetime(),
  periodEnd: z.string().datetime(),
  amount: z.number().int(),
  currency: z.string().length(3),
  quantity: z.number().int().min(1).default(1),
});

export type AddInvoiceLineItemCommand = {
  invoiceId: string;
} & z.infer<typeof addInvoiceLineItemSchema>;
