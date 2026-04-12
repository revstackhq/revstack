import { Entity } from "@/domain/base/Entity";
import { generateId } from "@/utils/id";
import { SubscriptionPeriod } from "./SubscriptionPeriod";
import { CouponNotFoundError } from "./SubscriptionErrors";
import { CouponDuration, CouponType } from "../coupons/CouponEntity";
import { SubscriptionCouponValidator } from "./SubscriptionCouponValidator";
import { SubscriptionAddonManager } from "./SubscriptionAddonManager";
import {
  SubscriptionBillingPolicy,
  type CalculateNextInvoiceResult,
} from "./SubscriptionBillingPolicy";
import { SubscriptionStatusPolicy } from "./SubscriptionStatusPolicy";
import { SubscriptionCouponBenefitPolicy } from "./SubscriptionCouponBenefitPolicy";
import { SubscriptionEventFactory } from "./SubscriptionEventFactory";

export const SUBSCRIPTION_STATUSES = [
  "incomplete",
  "incomplete_expired",
  "trialing",
  "active",
  "past_due",
  "paused",
  "unpaid",
  "revoked",
  "canceled",
] as const;

export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUSES)[number];

export interface SubscriptionAddon {
  id: string;
  addonId: string;
  quantity: number;
  unitAmount: number;
}

export interface SubscriptionCoupon {
  id: string;
  couponId: string;
  type: CouponType;
  value: number;
  appliedAt: Date;
  benefitEndsAt?: Date;
}

export interface SubscriptionProps {
  id: string;
  environmentId: string;
  userId: string;
  customerId: string;
  planId: string;
  priceId: string;
  status: SubscriptionStatus;
  currency: string;
  period: SubscriptionPeriod;

  trialStart?: Date;
  trialEnd?: Date;

  cancelAtPeriodEnd: boolean;
  canceledAt?: Date;
  revokedAt?: Date;

  metadata: Record<string, unknown>;

  externalSubscriptionId?: string;
  pendingPlanId?: string;
  pendingPriceId?: string;
  scheduleChangeAt?: Date;

  addons: SubscriptionAddon[];
  coupons: SubscriptionCoupon[];

  createdAt: Date;
  updatedAt: Date;
}

export type CreateSubscriptionProps = Omit<
  SubscriptionProps,
  | "id"
  | "status"
  | "createdAt"
  | "updatedAt"
  | "cancelAtPeriodEnd"
  | "addons"
  | "coupons"
  | "period"
  | "metadata"
> & {
  period: SubscriptionPeriod;
  addons?: SubscriptionAddon[];
  coupons?: SubscriptionCoupon[];
  metadata?: Record<string, unknown>;
};

export interface ApplyCouponInput {
  id: string;
  type: CouponType;
  amount: number;
  currency?: string | null;
  restrictedPlanIds: string[];
  expiresAt?: Date | null;
  duration: CouponDuration;
  durationInMonths: number;
  status: string;
}

export class SubscriptionEntity extends Entity<SubscriptionProps> {
  private readonly statusPolicy = new SubscriptionStatusPolicy();
  private readonly couponBenefitPolicy = new SubscriptionCouponBenefitPolicy();
  private readonly eventFactory = new SubscriptionEventFactory();

  private constructor(props: SubscriptionProps) {
    super(props);
  }

  public static readonly ACTIONS = {
    ADD_ADDON: "ADD_ADDON",
    REMOVE_ADDON: "REMOVE_ADDON",
    CANCEL: "CANCEL",
    ACTIVATE: "ACTIVATE",
    END_TRIAL: "END_TRIAL",
    MODIFY: "MODIFY",
    UPGRADE_PLAN: "UPGRADE_PLAN",
    APPLY_COUPON: "APPLY_COUPON",
    REMOVE_COUPON: "REMOVE_COUPON",
  };

  public static restore(props: SubscriptionProps): SubscriptionEntity {
    return new SubscriptionEntity(props);
  }

  public static create(props: CreateSubscriptionProps): SubscriptionEntity {
    const now = new Date();

    const entity = new SubscriptionEntity({
      ...props,
      id: generateId("sub"),
      status: props.period.isWithinTrial ? "trialing" : "active",
      cancelAtPeriodEnd: false,
      coupons:
        props.coupons?.map((c) => ({
          id: c.id ?? generateId("scoup"),
          couponId: c.couponId,
          type: c.type,
          value: c.value,
          appliedAt: c.appliedAt ?? now,
          benefitEndsAt: c.benefitEndsAt,
        })) ?? [],
      addons:
        props.addons?.map((a) => ({
          id: a.id ?? generateId("sadd"),
          addonId: a.addonId,
          quantity: a.quantity,
          unitAmount: a.unitAmount,
        })) ?? [],
      metadata: props.metadata ?? {},
      createdAt: now,
      updatedAt: now,
    });

    entity.addEvent(
      entity.eventFactory.created({
        id: entity.val.id,
        environmentId: entity.val.environmentId,
        customerId: entity.val.customerId,
        planId: entity.val.planId,
        status: entity.val.status,
      }),
    );

    return entity;
  }

  get isTrialing(): boolean {
    return this.props.status === "trialing";
  }

  get isActive(): boolean {
    return this.props.status === "active";
  }

  get isPaused(): boolean {
    return this.props.status === "paused";
  }

  get isPendingPayment(): boolean {
    return ["past_due", "unpaid", "incomplete"].includes(this.props.status);
  }

  get isDead(): boolean {
    return ["canceled", "revoked", "incomplete_expired"].includes(
      this.props.status,
    );
  }

  get isTrialValid(): boolean {
    return this.props.period.isTrialValid;
  }

  get isExpired(): boolean {
    return this.props.period.isExpired;
  }

  get isWithinTrial(): boolean {
    return this.props.period.isWithinTrial;
  }

  get isExpiringSoon(): boolean {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    return (
      this.props.period.currentPeriodEnd <= nextWeek &&
      !this.props.cancelAtPeriodEnd
    );
  }

  public canAccessService(): boolean {
    if (this.isActive) return true;
    if (this.isTrialing) return this.isTrialValid;
    if (this.props.status === "past_due") return true;

    return false;
  }

  public hasAccess(
    options: { allowPastDue: boolean } = { allowPastDue: true },
  ): boolean {
    if (this.isDead) return false;
    if (this.props.status === "unpaid") return false;

    if (this.isPaused) {
      return !this.isExpired;
    }

    if (this.props.status === "past_due") {
      return options.allowPastDue;
    }

    if (this.isTrialing) {
      return this.isTrialValid;
    }

    return true;
  }

  private ensureCanModify(action: string): void {
    this.statusPolicy.ensureCanModify({
      id: this.val.id,
      status: this.props.status,
      action,
    });
  }

  public markAsPastDue(): void {
    if (this.isDead) return;
    this.applyChanges({ status: "past_due" });
  }

  public markAsUnpaid(): void {
    if (this.isDead) return;
    this.applyChanges({ status: "unpaid" });
  }

  public activate(): void {
    this.statusPolicy.ensureCanActivate(
      SubscriptionEntity.ACTIONS.ACTIVATE,
      this.props.status,
    );

    this.applyChanges({
      status: "active",
      cancelAtPeriodEnd: false,
    });

    this.addEvent(
      this.eventFactory.updated({
        id: this.val.id,
        environmentId: this.val.environmentId,
        changes: ["status", "cancelAtPeriodEnd"],
      }),
    );
  }

  public addAddon(
    addonId: string,
    unitAmount: number,
    quantity: number = 1,
  ): void {
    this.ensureCanModify(SubscriptionEntity.ACTIONS.ADD_ADDON);

    const addonManager = new SubscriptionAddonManager();
    const result = addonManager.add(
      { addonId, unitAmount, quantity },
      {
        action: SubscriptionEntity.ACTIONS.ADD_ADDON,
        status: this.props.status,
        isPendingPayment: this.isPendingPayment,
        addons: this.props.addons,
      },
    );

    this.props.addons = result.addons;

    this.touch();
    this.addEvent(
      this.eventFactory.addonAdded({
        subscriptionId: this.val.id,
        environmentId: this.val.environmentId,
        addonId,
        quantity: result.addedQuantity,
      }),
    );
  }

  public removeAddon(addonId: string): void {
    this.ensureCanModify(SubscriptionEntity.ACTIONS.REMOVE_ADDON);

    const addonManager = new SubscriptionAddonManager();
    const result = addonManager.remove(
      { addonId },
      { addons: this.props.addons },
    );

    this.props.addons = result.addons;

    this.touch();
    this.addEvent(
      this.eventFactory.addonRemoved({
        subscriptionId: this.val.id,
        environmentId: this.val.environmentId,
        addonId,
      }),
    );
  }

  public applyCoupon(input: ApplyCouponInput, now: Date = new Date()): void {
    this.ensureCanModify(SubscriptionEntity.ACTIONS.APPLY_COUPON);

    const validator = new SubscriptionCouponValidator();
    validator.validate(input, {
      planId: this.props.planId,
      currency: this.props.currency,
      existingCoupons: this.props.coupons,
    });

    const benefitEndsAt = this.couponBenefitPolicy.calculateBenefitEndsAt(
      input,
      this.props.period,
      this.props.createdAt,
    );

    this.props.coupons.push({
      id: generateId("scoup"),
      couponId: input.id,
      type: input.type,
      value: input.amount,
      appliedAt: now,
      benefitEndsAt,
    });

    this.touch();

    this.addEvent(
      this.eventFactory.couponApplied({
        subscriptionId: this.val.id,
        environmentId: this.val.environmentId,
        couponId: input.id,
      }),
    );
  }

  public calculateNextInvoice(
    baseAmount: number,
    asOf?: Date,
  ): CalculateNextInvoiceResult {
    const billingPolicy = new SubscriptionBillingPolicy();

    return billingPolicy.calculateNextInvoice({
      baseAmount,
      currency: this.props.currency,
      periodStart: this.props.period.currentPeriodStart,
      periodEnd: this.props.period.currentPeriodEnd,
      addons: this.props.addons,
      coupons: this.props.coupons,
      asOf,
    });
  }

  public removeCoupon(couponId: string): void {
    this.ensureCanModify(SubscriptionEntity.ACTIONS.REMOVE_COUPON);

    const exists = this.props.coupons.some((c) => c.couponId === couponId);
    if (!exists) {
      throw new CouponNotFoundError(couponId);
    }

    this.props.coupons = this.props.coupons.filter(
      (c) => c.couponId !== couponId,
    );

    this.touch();

    this.addEvent(
      this.eventFactory.couponRemoved({
        subscriptionId: this.val.id,
        environmentId: this.val.environmentId,
        couponId: couponId,
        reason: "manual_remove",
      }),
    );
  }

  public cleanupExpiredCoupons(now: Date = new Date()): void {
    const expiredCoupons = this.props.coupons.filter(
      (c) => c.benefitEndsAt && c.benefitEndsAt < now,
    );

    if (expiredCoupons.length === 0) return;

    this.props.coupons = this.props.coupons.filter(
      (c) => !c.benefitEndsAt || c.benefitEndsAt >= now,
    );

    this.touch();

    for (const coupon of expiredCoupons) {
      this.addEvent(
        this.eventFactory.couponRemoved({
          subscriptionId: this.val.id,
          environmentId: this.val.environmentId,
          couponId: coupon.couponId,
          reason: "benefit_ended",
        }),
      );
    }
  }

  public cancel(immediately: boolean = false, now: Date = new Date()): void {
    this.statusPolicy.ensureCanCancel(
      SubscriptionEntity.ACTIONS.CANCEL,
      this.props.status,
    );

    if (immediately) {
      this.applyChanges({
        status: "canceled",
        canceledAt: now,
        cancelAtPeriodEnd: false,
        pendingPlanId: undefined,
        pendingPriceId: undefined,
        scheduleChangeAt: undefined,
      });
    } else {
      this.applyChanges({
        cancelAtPeriodEnd: true,
      });
    }

    this.addEvent(
      this.eventFactory.canceled({
        id: this.val.id,
        environmentId: this.val.environmentId,
        immediately,
      }),
    );
  }

  public changePlan(newPlanId: string, newPriceId: string): void {
    this.ensureCanModify(SubscriptionEntity.ACTIONS.UPGRADE_PLAN);

    this.applyChanges({
      planId: newPlanId,
      priceId: newPriceId,
    });
    this.addEvent(
      this.eventFactory.updated({
        id: this.val.id,
        environmentId: this.val.environmentId,
        changes: ["planId", "priceId"],
      }),
    );
  }

  public endTrial(now: Date = new Date()): void {
    this.statusPolicy.ensureCanEndTrial({
      status: this.props.status,
      isTrialValid: this.isTrialValid,
      action: SubscriptionEntity.ACTIONS.END_TRIAL,
    });

    this.applyChanges({
      status: "active",
      period: SubscriptionPeriod.create({
        ...this.props.period.toJSON(),
        trialEnd: now,
      }),
    });
    this.addEvent(
      this.eventFactory.trialEnded({
        id: this.val.id,
        environmentId: this.val.environmentId,
      }),
    );
  }

  public revoke(now: Date = new Date()): void {
    this.statusPolicy.ensureCanModify({
      id: this.val.id,
      status: this.props.status,
      action: SubscriptionEntity.ACTIONS.MODIFY,
    });

    this.applyChanges({
      status: "revoked",
      revokedAt: now,
      cancelAtPeriodEnd: false,
      pendingPlanId: undefined,
      pendingPriceId: undefined,
      scheduleChangeAt: undefined,
    });

    this.addEvent(
      this.eventFactory.revoked({
        id: this.val.id,
        environmentId: this.val.environmentId,
        revokedAt: now,
      }),
    );
  }

  public scheduleUpdate(
    newPlanId: string,
    newPriceId: string,
    effectiveAt: Date,
    now: Date = new Date(),
  ): void {
    this.ensureCanModify(SubscriptionEntity.ACTIONS.MODIFY);

    this.statusPolicy.ensureScheduleUpdateIsFuture(effectiveAt, now);

    this.applyChanges({
      pendingPlanId: newPlanId,
      pendingPriceId: newPriceId,
      scheduleChangeAt: effectiveAt,
    });
    this.addEvent(
      this.eventFactory.scheduleUpdated({
        id: this.val.id,
        environmentId: this.val.environmentId,
        pendingPriceId: newPriceId,
        pendingPlanId: newPlanId,
        effectiveAt,
      }),
    );
  }

  public applyScheduledChanges(now: Date = new Date()): void {
    if (!this.props.pendingPlanId || !this.props.pendingPriceId) return;

    if (this.props.scheduleChangeAt && this.props.scheduleChangeAt > now)
      return;

    this.applyChanges({
      planId: this.props.pendingPlanId,
      priceId: this.props.pendingPriceId,
      pendingPlanId: undefined,
      pendingPriceId: undefined,
      scheduleChangeAt: undefined,
    });
    this.addEvent(
      this.eventFactory.updated({
        id: this.val.id,
        environmentId: this.val.environmentId,
        changes: ["planId", "priceId", "scheduleChangeAt"],
      }),
    );
  }

  public updatePeriod(start: Date, end: Date): void {
    this.ensureCanModify(SubscriptionEntity.ACTIONS.MODIFY);

    this.applyChanges({
      period: SubscriptionPeriod.create({
        ...this.props.period.toJSON(),
        currentPeriodStart: start,
        currentPeriodEnd: end,
      }),
    });
    this.addEvent(
      this.eventFactory.updated({
        id: this.val.id,
        environmentId: this.val.environmentId,
        changes: ["currentPeriodStart", "currentPeriodEnd"],
      }),
    );
  }

  public pause(): void {
    this.ensureCanModify(SubscriptionEntity.ACTIONS.MODIFY);

    if (this.isPaused) return;

    this.statusPolicy.ensureCanPause({
      status: this.props.status,
      isPendingPayment: this.isPendingPayment,
      isTrialing: this.isTrialing,
      action: SubscriptionEntity.ACTIONS.MODIFY,
    });

    this.applyChanges({ status: "paused" });

    this.addEvent(
      this.eventFactory.paused({
        id: this.val.id,
        environmentId: this.val.environmentId,
      }),
    );
  }

  public resume(): void {
    this.statusPolicy.ensureCanResume({
      status: this.props.status,
      action: SubscriptionEntity.ACTIONS.ACTIVATE,
    });

    this.applyChanges({
      status: "active",
      cancelAtPeriodEnd: false,
    });

    this.addEvent(
      this.eventFactory.resumed({
        id: this.val.id,
        environmentId: this.val.environmentId,
        requiresImmediateBilling: this.isExpired,
      }),
    );
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }

  private applyChanges(changes: Partial<SubscriptionProps>): void {
    Object.assign(this.props, changes);
    this.touch();
  }
}
