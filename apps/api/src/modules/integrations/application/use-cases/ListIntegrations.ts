import { z } from "zod";
import type { IntegrationRepository } from "@revstackhq/core";

export const listIntegrationsSchema = z.object({
  status: z.enum(["installed", "uninstalled", "error"]).optional(),
  providerId: z.string().optional(),
});

export type ListIntegrationsQuery = z.infer<typeof listIntegrationsSchema>;

export class ListIntegrationsHandler {
  constructor(private readonly repository: IntegrationRepository) {}

  public async execute(query: ListIntegrationsQuery) {
    return this.repository.find({
      status: query.status,
      providerId: query.providerId,
    });
  }
}
