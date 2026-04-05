import { z } from "zod";
import type { UsageRepository } from "@revstackhq/core";

export const listUsagesSchema = z.object({
  customerId: z.string().min(1, "Customer ID is required"),
  featureId: z.string().optional(),
});

export type ListUsagesQuery = z.infer<typeof listUsagesSchema>;

export class ListUsagesHandler {
  constructor(private readonly repository: UsageRepository) {}

  public async execute(query: ListUsagesQuery) {
    const records = await this.repository.findRecords({
      customerId: query.customerId,
      featureId: query.featureId,
    });
    return records;
  }
}
