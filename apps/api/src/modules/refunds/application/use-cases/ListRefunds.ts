import { z } from "zod";
import type { RefundRepository } from "@revstackhq/core";

export const listRefundsSchema = z.object({
  paymentId: z.string().optional(),
  status: z.enum(["pending", "succeeded", "failed"]).optional(),
});

export type ListRefundsQuery = z.infer<typeof listRefundsSchema>;

export class ListRefundsHandler {
  constructor(private readonly repository: RefundRepository) {}

  public async execute(query: ListRefundsQuery) {
    const refunds = await this.repository.find({
      paymentId: query.paymentId,
      status: query.status,
    });
    return refunds;
  }
}
