import { BadRequestError } from "@/common/errors/DomainError";

export interface CouponProps {
  id: string;
  environmentId: string;
  code: string;
  type: string; // "percent" or "fixed"
  amount: number;
  isActive: boolean;
  isArchived: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export class CouponEntity {
  private constructor(private readonly props: CouponProps) {}

  get id() { return this.props.id; }
  get environmentId() { return this.props.environmentId; }
  get code() { return this.props.code; }
  get type() { return this.props.type; }
  get amount() { return this.props.amount; }
  get isActive() { return this.props.isActive; }
  get isArchived() { return this.props.isArchived; }
  get metadata() { return this.props.metadata || {}; }
  get createdAt() { return this.props.createdAt; }
  get updatedAt() { return this.props.updatedAt; }

  public static restore(props: CouponProps): CouponEntity {
    return new CouponEntity(props);
  }

  public static create(
    props: Omit<CouponProps, "id" | "isActive" | "isArchived" | "createdAt" | "updatedAt">
  ): CouponEntity {
    if (!props.code) {
      throw new BadRequestError("Coupon code is required");
    }
    if (props.amount < 0) {
      throw new BadRequestError("Coupon amount cannot be negative");
    }
    if (props.type === "percent" && props.amount > 100) {
      throw new BadRequestError("Percentage discount cannot exceed 100%");
    }

    return new CouponEntity({
      ...props,
      id: crypto.randomUUID(),
      isActive: true, // Default to active
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public update(props: Partial<Pick<CouponProps, "isActive" | "metadata">>): void {
    if (props.isActive !== undefined) this.props.isActive = props.isActive;
    if (props.metadata !== undefined) this.props.metadata = { ...this.props.metadata, ...props.metadata };
    this.props.updatedAt = new Date();
  }

  public archive(): void {
    if (this.props.isArchived) {
      throw new BadRequestError("Coupon is already archived", "ALREADY_ARCHIVED");
    }
    this.props.isArchived = true;
    this.props.isActive = false; // Auto deactivate when archived
    this.props.updatedAt = new Date();
  }

  public toPrimitives(): CouponProps {
    return { ...this.props };
  }
}
