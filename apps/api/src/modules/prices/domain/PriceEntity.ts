import { Entity } from "@/common/domain/Entity";
import { BadRequestError } from "@/common/errors/DomainError";

export interface PriceProps {
  id?: string;
  environmentId: string;
  name: string;
  amount: number;
  currency: string;
  interval?: string;
  type: string;
  planId?: string;
  addonId?: string;
  isArchived: boolean;
  version: number;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export class PriceEntity extends Entity<PriceProps> {
  private constructor(props: PriceProps) {
    super(props);
  }

  public static restore(props: PriceProps): PriceEntity {
    return new PriceEntity(props);
  }

  public static create(
    props: Omit<PriceProps, "id" | "isArchived" | "version" | "createdAt" | "updatedAt">,
  ): PriceEntity {
    if (props.type === "recurring" && !props.interval) {
      throw new BadRequestError("Recurring prices require an interval", "INVALID_PRICE");
    }
    if (props.amount < 0) {
      throw new BadRequestError("Amount cannot be negative", "INVALID_PRICE");
    }

    return new PriceEntity({
      ...props,
      isArchived: false,
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public update(props: Partial<Pick<PriceProps, "name" | "metadata">>): void {
    if (props.name !== undefined) this.props.name = props.name;
    if (props.metadata !== undefined)
      this.props.metadata = { ...this.props.metadata, ...props.metadata };
    this.props.updatedAt = new Date();
  }

  public archive(): void {
    this.props.isArchived = true;
    this.props.updatedAt = new Date();
  }

  public createNewVersion(amount: number, currency?: string): PriceEntity {
    this.archive();
    return new PriceEntity({
      ...this.props,
      id: undefined,
      amount,
      currency: currency || this.props.currency,
      version: this.props.version + 1,
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
