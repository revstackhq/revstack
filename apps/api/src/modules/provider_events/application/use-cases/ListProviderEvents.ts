import { z } from "zod";
import type { ProviderEventRepository } from "@revstackhq/core";

export const listProviderEventsSchema = z.object({
  providerId: z.string().optional(),
  status: z.enum(["pending", "processed", "failed"]).optional(),
  eventType: z.string().optional(),
});

export type ListProviderEventsQuery = z.infer<typeof listProviderEventsSchema>;

export class ListProviderEventsHandler {
  constructor(private readonly repository: ProviderEventRepository) {}

  public async execute(query: ListProviderEventsQuery) {
    return this.repository.find({
      providerId: query.providerId,
      status: query.status,
      eventType: query.eventType,
    });
  }
}
