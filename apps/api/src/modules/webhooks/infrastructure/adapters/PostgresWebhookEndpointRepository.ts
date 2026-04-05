import type { WebhookEndpointRepository } from "@revstackhq/core";
import type { WebhookEndpointEntity } from "@revstackhq/core";
import type { WebhookDeliveryEntity } from "@revstackhq/core";

export class PostgresWebhookEndpointRepository implements WebhookEndpointRepository {
  constructor(private readonly db: any) {}

  async save(endpoint: WebhookEndpointEntity): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async findById(id: string): Promise<WebhookEndpointEntity | null> {
    throw new Error("Method not implemented.");
  }

  async findAll(): Promise<WebhookEndpointEntity[]> {
    throw new Error("Method not implemented.");
  }

  async saveDelivery(delivery: WebhookDeliveryEntity): Promise<void> {
    // Scaffold implementation
  }

  async findDeliveries(endpointId: string): Promise<WebhookDeliveryEntity[]> {
    return [];
  }
}

