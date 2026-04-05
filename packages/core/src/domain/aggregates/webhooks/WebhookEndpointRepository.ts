import type { WebhookEndpointEntity } from "@/domain/aggregates/webhooks/WebhookEndpointEntity";
import type { WebhookDeliveryEntity } from "@/domain/aggregates/webhooks/WebhookDeliveryEntity";

export interface WebhookEndpointRepository {
  save(endpoint: WebhookEndpointEntity): Promise<void>;
  findById(id: string): Promise<WebhookEndpointEntity | null>;
  findAll(): Promise<WebhookEndpointEntity[]>;
  saveDelivery(delivery: WebhookDeliveryEntity): Promise<void>;
  findDeliveries(endpointId: string): Promise<WebhookDeliveryEntity[]>;
}
