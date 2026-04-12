import { Entity } from "@/domain/base/Entity";
import { generateId } from "@/utils/id";
import {
  CouponArchivedEvent,
  CouponCreatedEvent,
  CouponUpdatedEvent,
} from "@/domain/aggregates/coupons/CouponEvents";
import {
  CouponCodeRequiredError,
  InvalidCouponAmountError,
  CouponCurrencyRequiredError,
  CouponAlreadyArchivedError,
  CouponExpiredError,
  CouponLimitReachedError,
  IneligibleCouponError,
} from "@/domain/aggregates/coupons/CouponErrors";

export type CouponStatus = "active" | "inactive" | "archived";
export type CouponType = "fixed_amount" | "percentage";
export type CouponDuration = "forever" | "once" | "repeating";

export interface CouponProps {
  id: string;
  environmentId: string;
  code: string;
  type: CouponType;
  amount: number;
  currency?: string;
  duration: CouponDuration;
  durationInMonths?: number;
  maxRedemptions?: number;
  redemptionsCount: number;
  restrictedPlanIds: string[];
  isFirstTimeOnly: boolean;
  status: CouponStatus;
  metadata: Record<string, unknown>;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateCouponProps = Omit<
  CouponProps,
  "id" | "status" | "createdAt" | "updatedAt" | "redemptionsCount"
>;

export class CouponEntity extends Entity<CouponProps> {
  private constructor(props: CouponProps) {
    super(props);
  }

  public static restore(props: CouponProps): CouponEntity {
    return new CouponEntity(props);
  }

  public static create(props: CreateCouponProps): CouponEntity {
    if (!props.code) throw new CouponCodeRequiredError();

    if (props.amount < 0) throw new InvalidCouponAmountError();

    if (props.type === "percentage" && props.amount > 100) {
      throw new InvalidCouponAmountError(
        "Percentage discount cannot exceed 100%",
      );
    }

    if (props.type === "fixed_amount" && !props.currency) {
      throw new CouponCurrencyRequiredError();
    }

    const coupon = new CouponEntity({
      ...props,
      id: generateId("cou"),
      status: "active",
      redemptionsCount: 0,
      metadata: props.metadata ?? {},
      restrictedPlanIds: props.restrictedPlanIds ?? [],
      isFirstTimeOnly: props.isFirstTimeOnly ?? false,
      createdAt: new Date(),
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

  public update(
    props: Partial<
      Pick<CouponProps, "status" | "metadata" | "maxRedemptions" | "expiresAt">
    >,
  ): void {
    const changes: string[] = [];

    if (props.status !== undefined && props.status !== this.props.status) {
      this.props.status = props.status;
      changes.push("status");
    }

    if (props.metadata !== undefined) {
      this.props.metadata = { ...this.props.metadata, ...props.metadata };
      changes.push("metadata");
    }

    if (
      props.maxRedemptions !== undefined &&
      props.maxRedemptions !== this.props.maxRedemptions
    ) {
      this.props.maxRedemptions = props.maxRedemptions;
      changes.push("maxRedemptions");
    }

    if (
      props.expiresAt !== undefined &&
      props.expiresAt !== this.props.expiresAt
    ) {
      this.props.expiresAt = props.expiresAt;
      changes.push("expiresAt");
    }

    if (changes.length > 0) {
      this.props.updatedAt = new Date();
      this.addEvent(
        new CouponUpdatedEvent({
          id: this.val.id,
          environmentId: this.val.environmentId,
          changes,
        }),
      );
    }
  }

  public archive(): void {
    if (this.props.status === "archived") {
      throw new CouponAlreadyArchivedError(this.val.id);
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

  public incrementRedemption(): void {
    if (
      this.props.maxRedemptions &&
      this.props.redemptionsCount >= this.props.maxRedemptions
    ) {
      throw new CouponLimitReachedError(this.props.code);
    }

    this.props.redemptionsCount += 1;
    this.props.updatedAt = new Date();
  }

  public validateForCustomer(
    planId?: string,
    isFirstTime: boolean = false,
  ): void {
    if (this.props.status !== "active") {
      throw new IneligibleCouponError(this.props.code, "Coupon is not active");
    }

    if (this.props.expiresAt && this.props.expiresAt < new Date()) {
      throw new CouponExpiredError(this.props.code);
    }

    if (
      this.props.maxRedemptions &&
      this.props.redemptionsCount >= this.props.maxRedemptions
    ) {
      throw new CouponLimitReachedError(this.props.code);
    }

    if (this.props.isFirstTimeOnly && !isFirstTime) {
      throw new IneligibleCouponError(
        this.props.code,
        "Coupon only valid for first-time customers",
      );
    }

    if (this.props.restrictedPlanIds.length > 0) {
      if (!planId || !this.props.restrictedPlanIds.includes(planId)) {
        throw new IneligibleCouponError(
          this.props.code,
          "Coupon not valid for this plan",
        );
      }
    }
  }
}
