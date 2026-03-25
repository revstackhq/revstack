import type { WebhookEndpointRepository } from "@/modules/webhooks/application/ports/WebhookEndpointRepository";
import type { WebhookEndpointEntity } from "@/modules/webhooks/domain/WebhookEndpointEntity";
import type { WebhookDeliveryEntity } from "@/modules/webhooks/domain/WebhookDeliveryEntity";

export class PostgresWebhookEndpointRepo implements WebhookEndpointRepository {
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

