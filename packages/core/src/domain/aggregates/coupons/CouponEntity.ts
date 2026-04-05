import { Entity } from "@/domain/base/Entity";
import { BadRequestError } from "@/domain/base/DomainError";
import { generateId } from "@/utils";
import {
  CouponArchivedEvent,
  CouponCreatedEvent,
  CouponDeletedEvent,
  CouponUpdatedEvent,
} from "@/domain/aggregates/coupons/CouponEvents";

export interface CouponProps {
  id: string;
  environmentId: string;
  duration: "forever" | "once" | "repeating";
  durationInMonths?: number;
  maxRedemptions?: number;
  code: string;
  type: "fixed" | "percent";
  amount: number;
  status: "active" | "inactive" | "archived";
  metadata?: Record<string, unknown>;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateCouponProps = Omit<
  CouponProps,
  "id" | "status" | "createdAt" | "updatedAt"
>;

export type UpdateCouponProps = Partial<
  Pick<
    CouponProps,
    | "status"
    | "metadata"
    | "durationInMonths"
    | "maxRedemptions"
    | "expiresAt"
  >
>;

export class CouponEntity extends Entity<CouponProps> {
  private constructor(props: CouponProps) {
    super(props);
  }

  public static restore(props: CouponProps): CouponEntity {
    return new CouponEntity(props);
  }

  public static create(props: CreateCouponProps): CouponEntity {
    if (!props.code) {
      throw new BadRequestError("Coupon code is required");
    }
    if (props.amount < 0) {
      throw new BadRequestError("Coupon amount cannot be negative");
    }
    if (props.type === "percent" && props.amount > 100) {
      throw new BadRequestError("Percentage discount cannot exceed 100%");
    }

    const coupon = new CouponEntity({
      ...props,
      id: generateId("cou"),
      status: "active",
      createdAt: new Date(),
      durationInMonths: props.durationInMonths ?? undefined,
      maxRedemptions: props.maxRedemptions ?? undefined,
      expiresAt: props.expiresAt ?? undefined,
      metadata: props.metadata ?? {},
      updatedAt: new Date(),
    });

    coupon.addEvent(
      new CouponCreatedEvent({
        id: coupon.val.id,
        code: coupon.val.code,
        environmentId: coupon.val.environmentId,
      }),
    );

    return coupon;
  }

  public update(props: UpdateCouponProps): void {
    if (props.status !== undefined) {
      this.props.status = props.status;
    }

    if (props.metadata !== undefined) {
      this.props.metadata = { ...this.props.metadata, ...props.metadata };
    }

    this.props.updatedAt = new Date();

    this.addEvent(
      new CouponUpdatedEvent({
        id: this.val.id,
        environmentId: this.val.environmentId,
      }),
    );
  }

  public archive(): void {
    if (this.props.status === "archived") {
      throw new BadRequestError(
        "Coupon is already archived",
        "ALREADY_ARCHIVED",
      );
    }

    this.props.status = "archived";
    this.props.updatedAt = new Date();

    this.addEvent(
      new CouponArchivedEvent({
        id: this.val.id,
        environmentId: this.val.environmentId,
      }),
    );
  }

  public delete(): void {
    this.addEvent(
      new CouponDeletedEvent({
        id: this.val.id,
        environmentId: this.val.environmentId,
      }),
    );
  }
}
