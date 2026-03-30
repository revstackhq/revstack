import type { WebhookEndpointRepository } from "@/modules/webhooks/application/ports/WebhookEndpointRepository";
import type { ListWebhookDeliveriesQuery } from "./ListWebhookDeliveries.schema";

export class ListWebhookDeliveriesHandler {
  constructor(private readonly repository: WebhookEndpointRepository) {}

  public async execute(query: ListWebhookDeliveriesQuery) {
    // Assuming the repository has a method for finding deliveries related to an endpoint
    return this.repository.findDeliveries(query.endpointId);
  }
}
