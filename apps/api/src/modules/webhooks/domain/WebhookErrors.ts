export class WebhookEndpointNotFoundError extends Error {
  constructor(id: string) {
    super(`Webhook endpoint with ID ${id} was not found.`);
    this.name = "WebhookEndpointNotFoundError";
  }
}
