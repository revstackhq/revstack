import { Entity } from "@/common/domain/Entity";
import { BadRequestError } from "@/common/errors/DomainError";

export interface CouponProps {
  id?: string;
  environmentId: string;
  code: string;
  type: string;
  amount: number;
  isActive: boolean;
  isArchived: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export class CouponEntity extends Entity<CouponProps> {
  private constructor(props: CouponProps) {
    super(props);
  }

  public static restore(props: CouponProps): CouponEntity {
    return new CouponEntity(props);
  }

  public static create(
    props: Omit<CouponProps, "id" | "isActive" | "isArchived" | "createdAt" | "updatedAt">,
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
      isActive: true,
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public update(props: Partial<Pick<CouponProps, "isActive" | "metadata">>): void {
    if (props.isActive !== undefined) this.props.isActive = props.isActive;
    if (props.metadata !== undefined)
      this.props.metadata = { ...this.props.metadata, ...props.metadata };
    this.props.updatedAt = new Date();
  }

  public archive(): void {
    if (this.props.isArchived) {
      throw new BadRequestError("Coupon is already archived", "ALREADY_ARCHIVED");
    }
    this.props.isArchived = true;
    this.props.isActive = false;
    this.props.updatedAt = new Date();
  }
}
