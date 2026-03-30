import { Entity } from "@/common/domain/Entity";

export interface WebhookEndpointProps {
  id?: string;
  url: string;
  events: string[];
  secret: string;
  isActive: boolean;
  status: "active" | "inactive";
}

export class WebhookEndpointEntity extends Entity<WebhookEndpointProps> {
  private constructor(props: WebhookEndpointProps) {
    super(props);
  }

  public static restore(props: WebhookEndpointProps): WebhookEndpointEntity {
    return new WebhookEndpointEntity(props);
  }

  public static create(url: string, events: string[]): WebhookEndpointEntity {
    const secret = "whsec_" + crypto.randomUUID().replace(/-/g, "");
    return new WebhookEndpointEntity({
      url,
      events,
      secret,
      isActive: true,
      status: "active",
    });
  }

  public disable(): void {
    if (!this.props.isActive) {
      throw new Error("WebhookEndpointAlreadyDisabled");
    }
    this.props.isActive = false;
    this.props.status = "inactive";
  }

  public deactivate(): void {
    this.disable();
  }

  public rotateSecret(): { secret: string; oldSecret: string } {
    const oldSecret = this.props.secret;
    this.props.secret = "whsec_" + crypto.randomUUID().replace(/-/g, "");
    return { secret: this.props.secret, oldSecret };
  }
}
