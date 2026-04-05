import { z } from "zod";
import type { WebhookEndpointRepository } from "@revstackhq/core";

export const listWebhookDeliveriesSchema = z.object({
  endpoint_id: z.string(),
});

export type ListWebhookDeliveriesQuery = z.infer<
  typeof listWebhookDeliveriesSchema
>;

export class ListWebhookDeliveriesHandler {
  constructor(private readonly repository: WebhookEndpointRepository) {}

  public async execute(query: ListWebhookDeliveriesQuery) {
    return this.repository.findDeliveries(query.endpoint_id);
  }
}
