import { z } from "zod";
import type { PriceRepository } from "@revstackhq/core";

export const listPricesSchema = z.object({
  environmentId: z.string().min(1, "Environment is required"),
  planId: z.string().optional(),
  addonId: z.string().optional(),
  isArchived: z.enum(["true", "false"]).transform(v => v === "true").optional(),
});

export type ListPricesQuery = z.infer<typeof listPricesSchema>;

export class ListPricesHandler {
  constructor(private readonly repository: PriceRepository) {}

  public async execute(query: ListPricesQuery) {
    const prices = await this.repository.find({
      environmentId: query.environmentId,
      planId: query.planId,
      addonId: query.addonId,
      isArchived: query.isArchived,
    });
    return prices.map(p => p.val);
  }
}
