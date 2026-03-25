export class SubscriptionEntity {
  constructor(
    public readonly id: string,
    public customerId: string,
    public planId: string,
    public priceId: string,
    public status: "active" | "canceled" | "past_due" | "paused" = "active",
    public couponId?: string,
    public isAutoRenew: boolean = true
  ) {}

  public static create(customerId: string, planId: string, priceId: string, couponId?: string): SubscriptionEntity {
    return new SubscriptionEntity(crypto.randomUUID(), customerId, planId, priceId, "active", couponId, true);
  }

  public cancel(): void {
    if (this.status === "canceled") {
      throw new Error("SubscriptionAlreadyCanceled");
    }
    this.status = "canceled";
  }

  public pause(): void {
    if (this.status !== "active") {
      throw new Error("OnlyActiveSubscriptionsCanBePaused");
    }
    this.status = "paused";
  }

  public update(props: { planId?: string; priceId?: string; couponId?: string | null; isAutoRenew?: boolean }): void {
    if (props.planId) this.planId = props.planId;
    if (props.priceId) this.priceId = props.priceId;
    if (props.couponId !== undefined) this.couponId = props.couponId === null ? undefined : props.couponId;
    if (props.isAutoRenew !== undefined) this.isAutoRenew = props.isAutoRenew;
  }
}
