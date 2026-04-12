import {
  InvalidSubscriptionStatusError,
  SubscriptionAlreadyCanceledError,
  SubscriptionAlreadyRevokedError,
  SubscriptionScheduleError,
} from "./SubscriptionErrors";
import type { SubscriptionStatus } from "./SubscriptionEntity";

const DEAD_STATUSES: SubscriptionStatus[] = [
  "canceled",
  "revoked",
  "incomplete_expired",
];

const PENDING_PAYMENT_STATUSES: SubscriptionStatus[] = [
  "past_due",
  "unpaid",
  "incomplete",
];

export interface ModifyStatusContext {
  id: string;
  status: SubscriptionStatus;
  action: string;
}

export interface EndTrialContext {
  status: SubscriptionStatus;
  isTrialValid: boolean;
  action: string;
}

export interface PauseContext {
  status: SubscriptionStatus;
  isPendingPayment: boolean;
  isTrialing: boolean;
  action: string;
}

export interface ResumeContext {
  status: SubscriptionStatus;
  action: string;
}

export class SubscriptionStatusPolicy {
  public isDead(status: SubscriptionStatus): boolean {
    return DEAD_STATUSES.includes(status);
  }

  public isPendingPayment(status: SubscriptionStatus): boolean {
    return PENDING_PAYMENT_STATUSES.includes(status);
  }

  public ensureCanModify(context: ModifyStatusContext): void {
    if (context.status === "revoked") {
      throw new SubscriptionAlreadyRevokedError(context.id);
    }

    if (context.status === "canceled") {
      throw new SubscriptionAlreadyCanceledError(context.id);
    }

    if (this.isDead(context.status)) {
      throw new InvalidSubscriptionStatusError(
        context.action,
        context.status,
      );
    }

    if (context.status === "unpaid") {
      throw new InvalidSubscriptionStatusError(
        context.action,
        context.status,
        "Unpaid (must settle debt first)",
      );
    }
  }

  public ensureCanActivate(action: string, status: SubscriptionStatus): void {
    if (this.isDead(status)) {
      throw new InvalidSubscriptionStatusError(action, status);
    }
  }

  public ensureCanCancel(action: string, status: SubscriptionStatus): void {
    if (this.isDead(status)) {
      throw new InvalidSubscriptionStatusError(action, status);
    }
  }

  public ensureCanEndTrial(context: EndTrialContext): void {
    if (context.status !== "trialing") {
      throw new InvalidSubscriptionStatusError(context.action, context.status);
    }

    if (!context.isTrialValid) {
      throw new InvalidSubscriptionStatusError(
        context.action,
        "trial period has already expired",
      );
    }
  }

  public ensureCanPause(context: PauseContext): void {
    if (context.isPendingPayment) {
      throw new InvalidSubscriptionStatusError(
        context.action,
        context.status,
        "Cannot pause subscription with pending invoices. Settle debt first.",
      );
    }

    if (context.isTrialing) {
      throw new InvalidSubscriptionStatusError(
        context.action,
        context.status,
        "Trial subscriptions cannot be paused.",
      );
    }
  }

  public ensureCanResume(context: ResumeContext): void {
    if (context.status !== "paused") {
      throw new InvalidSubscriptionStatusError(
        context.action,
        context.status,
        "Only paused subscriptions can be resumed.",
      );
    }
  }

  public ensureScheduleUpdateIsFuture(
    effectiveAt: Date,
    now: Date,
  ): void {
    if (effectiveAt <= now) {
      throw new SubscriptionScheduleError(
        "Schedule date must be in the future.",
      );
    }
  }
}
