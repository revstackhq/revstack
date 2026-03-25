import { BadRequestError } from "@/common/errors/DomainError";

export interface PriceProps {
  id: string;
  environmentId: string;
  name: string;
  amount: number;
  currency: string;
  interval?: string; // e.g. "month", "year"
  type: string; // "recurring" or "one_time"
  planId?: string;
  addonId?: string;
  isArchived: boolean;
  version: number;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export class PriceEntity {
  private constructor(private readonly props: PriceProps) {}

  get id() { return this.props.id; }
  get environmentId() { return this.props.environmentId; }
  get name() { return this.props.name; }
  get amount() { return this.props.amount; }
  get currency() { return this.props.currency; }
  get interval() { return this.props.interval; }
  get type() { return this.props.type; }
  get planId() { return this.props.planId; }
  get addonId() { return this.props.addonId; }
  get isArchived() { return this.props.isArchived; }
  get version() { return this.props.version; }
  get metadata() { return this.props.metadata || {}; }
  get createdAt() { return this.props.createdAt; }
  get updatedAt() { return this.props.updatedAt; }

  public static restore(props: PriceProps): PriceEntity {
    return new PriceEntity(props);
  }

  public static create(
    props: Omit<PriceProps, "id" | "isArchived" | "version" | "createdAt" | "updatedAt">
  ): PriceEntity {
    if (props.type === "recurring" && !props.interval) {
      throw new BadRequestError("Recurring prices require an interval", "INVALID_PRICE");
    }
    if (props.amount < 0) {
      throw new BadRequestError("Amount cannot be negative", "INVALID_PRICE");
    }

    return new PriceEntity({
      ...props,
      id: crypto.randomUUID(),
      isArchived: false,
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public update(props: Partial<Pick<PriceProps, "name" | "metadata">>): void {
    if (props.name !== undefined) this.props.name = props.name;
    if (props.metadata !== undefined) this.props.metadata = { ...this.props.metadata, ...props.metadata };
    this.props.updatedAt = new Date();
  }

  public archive(): void {
    this.props.isArchived = true;
    this.props.updatedAt = new Date();
  }

  public createNewVersion(amount: number, currency?: string): PriceEntity {
    // Archives the current and creates a new one with bumped version
    this.archive();
    return new PriceEntity({
      ...this.props,
      id: crypto.randomUUID(),
      amount,
      currency: currency || this.props.currency,
      version: this.props.version + 1,
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public toPrimitives(): PriceProps {
    return { ...this.props };
  }
}
