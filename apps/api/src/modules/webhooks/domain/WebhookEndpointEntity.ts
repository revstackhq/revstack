export class WebhookEndpointEntity {
  constructor(
    public readonly id: string,
    public url: string,
    public events: string[],
    public secret: string,
    public isActive: boolean = true,
    public status: "active" | "inactive" = isActive ? "active" : "inactive"
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
    this.status = "inactive";
  }

  public deactivate(): void {
    this.disable();
  }

  public rotateSecret(): { secret: string; oldSecret: string } {
    const oldSecret = this.secret;
    this.secret = "whsec_" + crypto.randomUUID().replace(/-/g, "");
    return { secret: this.secret, oldSecret };
  }
}
