export class PlanEntity {
  constructor(
    public readonly id: string,
    public name: string,
    public isArchived: boolean = false,
    public isHidden: boolean = false,
    public description?: string,
    public currency?: string
  ) {}

  public static create(name: string, description?: string, currency?: string): PlanEntity {
    return new PlanEntity(crypto.randomUUID(), name, false, false, description, currency);
  }

  public archive(): void {
    if (this.isArchived) {
      throw new Error("PlanAlreadyArchived");
    }
    this.isArchived = true;
  }

  public hide(): void {
    if (this.isHidden) {
      throw new Error("PlanAlreadyHidden");
    }
    this.isHidden = true;
  }
}
