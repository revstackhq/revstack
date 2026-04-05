import { Entity } from "@/domain/base/Entity";

export interface WebhookEndpointProps {
  id?: string;
  environmentId: string;
  url: string;
  events: string[];
  secret: string;
  status: "active" | "inactive";
  createdAt: Date;
}

export class WebhookEndpointEntity extends Entity<WebhookEndpointProps> {
  private constructor(props: WebhookEndpointProps) {
    super(props);
  }

  public static restore(props: WebhookEndpointProps): WebhookEndpointEntity {
    return new WebhookEndpointEntity(props);
  }

  public static create(
    props: Omit<WebhookEndpointProps, "id" | "secret" | "status" | "createdAt">,
  ): WebhookEndpointEntity {
    const secret = "whsec_" + crypto.randomUUID().replace(/-/g, "");

    return new WebhookEndpointEntity({
      ...props,
      secret,
      status: "active",
      createdAt: new Date(),
    });
  }

  public deactivate(): void {
    if (this.props.status === "inactive") {
      throw new Error("WebhookEndpointAlreadyDisabled");
    }
    this.props.status = "inactive";
  }

  public rotateSecret(): { secret: string; oldSecret: string } {
    const oldSecret = this.props.secret;
    this.props.secret = "whsec_" + crypto.randomUUID().replace(/-/g, "");
    return { secret: this.props.secret, oldSecret };
  }
}
