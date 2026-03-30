import { z } from "zod";

export const updateInvoiceLineItemSchema = z.object({
  name: z.string().optional(),
  periodStart: z.string().datetime().optional(),
  periodEnd: z.string().datetime().optional(),
  amount: z.number().int().optional(),
  quantity: z.number().int().min(1).optional(),
});

export type UpdateInvoiceLineItemCommand = {
  invoiceId: string;
  lineId: string;
} & z.infer<typeof updateInvoiceLineItemSchema>;
