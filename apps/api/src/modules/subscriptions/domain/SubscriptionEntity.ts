import { Entity } from "@/common/domain/Entity";

export interface SubscriptionProps {
  id?: string;
  customerId: string;
  planId: string;
  priceId: string;
  status: "active" | "canceled" | "past_due" | "paused";
  couponId?: string;
  isAutoRenew: boolean;
}

export class SubscriptionEntity extends Entity<SubscriptionProps> {
  private constructor(props: SubscriptionProps) {
    super(props);
  }

  public static restore(props: SubscriptionProps): SubscriptionEntity {
    return new SubscriptionEntity(props);
  }

  public static create(
    customerId: string,
    planId: string,
    priceId: string,
    couponId?: string,
  ): SubscriptionEntity {
    return new SubscriptionEntity({
      customerId,
      planId,
      priceId,
      status: "active",
      couponId,
      isAutoRenew: true,
    });
  }

  public cancel(): void {
    if (this.props.status === "canceled") {
      throw new Error("SubscriptionAlreadyCanceled");
    }
    this.props.status = "canceled";
  }

  public pause(): void {
    if (this.props.status !== "active") {
      throw new Error("OnlyActiveSubscriptionsCanBePaused");
    }
    this.props.status = "paused";
  }

  public update(props: {
    planId?: string;
    priceId?: string;
    couponId?: string | null;
    isAutoRenew?: boolean;
  }): void {
    if (props.planId) this.props.planId = props.planId;
    if (props.priceId) this.props.priceId = props.priceId;
    if (props.couponId !== undefined)
      this.props.couponId =
        props.couponId === null ? undefined : props.couponId;
    if (props.isAutoRenew !== undefined)
      this.props.isAutoRenew = props.isAutoRenew;
  }
}
