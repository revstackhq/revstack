import type { IWebhookEndpointRepository } from "@/modules/webhooks/application/ports/IWebhookEndpointRepository";
import type { WebhookEndpointEntity } from "@/modules/webhooks/domain/WebhookEndpointEntity";

export class PostgresWebhookEndpointRepo implements IWebhookEndpointRepository {
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
}
