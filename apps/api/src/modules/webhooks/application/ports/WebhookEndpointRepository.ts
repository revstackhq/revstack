import type { WebhookEndpointEntity } from "@/modules/webhooks/domain/WebhookEndpointEntity";
import type { WebhookDeliveryEntity } from "@/modules/webhooks/domain/WebhookDeliveryEntity";

export interface WebhookEndpointRepository {
  save(endpoint: WebhookEndpointEntity): Promise<void>;
  findById(id: string): Promise<WebhookEndpointEntity | null>;
  findAll(): Promise<WebhookEndpointEntity[]>;
  saveDelivery(delivery: WebhookDeliveryEntity): Promise<void>;
  findDeliveries(endpointId: string): Promise<WebhookDeliveryEntity[]>;
}
