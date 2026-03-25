import { z } from "zod";

export const createInvoiceSchema = z.object({
  customerId: z.string().min(1, "Customer ID is required"),
  currency: z.string().length(3).default("USD"),
  dueDate: z.string().datetime().optional(),
  idempotencyKey: z.string().optional(),
});

export type CreateDraftInvoiceCommand = z.infer<typeof createInvoiceSchema>;
