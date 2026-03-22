export class WebhookEndpointEntity {
  constructor(
    public readonly id: string,
    public url: string,
    public events: string[],
    public secret: string,
    public isActive: boolean = true
  ) {}

  public static create(url: string, events: string[]): WebhookEndpointEntity {
    // Basic secret generation for scaffolding
    const secret = "whsec_" + crypto.randomUUID().replace(/-/g, "");
    return new WebhookEndpointEntity(crypto.randomUUID(), url, events, secret, true);
  }

  public disable(): void {
    if (!this.isActive) {
      throw new Error("WebhookEndpointAlreadyDisabled");
    }
    this.isActive = false;
  }
}
