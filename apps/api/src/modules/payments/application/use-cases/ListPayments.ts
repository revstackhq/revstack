import { z } from "zod";
import type { PaymentRepository } from "@revstackhq/core";

export const listPaymentsSchema = z.object({
  invoiceId: z.string().optional(),
  status: z.enum(["pending", "succeeded", "failed", "refunded"]).optional(),
});

export type ListPaymentsQuery = z.infer<typeof listPaymentsSchema>;

export class ListPaymentsHandler {
  constructor(private readonly repository: PaymentRepository) {}

  public async execute(query: ListPaymentsQuery) {
    const payments = await this.repository.find({
      invoiceId: query.invoiceId,
      status: query.status,
    });
    return payments;
  }
}
