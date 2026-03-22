import type { WebhookEndpointEntity } from "@/modules/webhooks/domain/WebhookEndpointEntity";

export interface IWebhookEndpointRepository {
  save(endpoint: WebhookEndpointEntity): Promise<void>;
  findById(id: string): Promise<WebhookEndpointEntity | null>;
  findAll(): Promise<WebhookEndpointEntity[]>;
}
