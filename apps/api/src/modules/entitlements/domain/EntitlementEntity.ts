export class EntitlementEntity {
  constructor(
    public readonly id: string,
    public name: string,
    public featureId: string,
    public type: "boolean" | "metered",
    public limit?: number
  ) {}

  public static create(name: string, featureId: string, type: "boolean" | "metered", limit?: number): EntitlementEntity {
    return new EntitlementEntity(crypto.randomUUID(), name, featureId, type, limit);
  }

  public updateLimit(newLimit: number): void {
    if (this.type !== "metered") {
      throw new Error("Cannot set limit on a boolean entitlement");
    }
    this.limit = newLimit;
  }
}
