export class SubscriptionEntity {
  constructor(
    public readonly id: string,
    public customerId: string,
    public planId: string,
    public priceId: string,
    public status: "active" | "canceled" | "past_due" | "paused" = "active"
  ) {}

  public static create(customerId: string, planId: string, priceId: string): SubscriptionEntity {
    return new SubscriptionEntity(crypto.randomUUID(), customerId, planId, priceId, "active");
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
}
