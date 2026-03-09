import { ProviderContext } from "@/context";
import { AsyncActionResult, PaginatedResult } from "@/types/shared";
import {
  CreateSubscriptionInput,
  Subscription,
  UpdateSubscriptionInput,
  CancelSubscriptionInput,
  PauseSubscriptionInput,
  ResumeSubscriptionInput,
  GetSubscriptionInput,
  ListSubscriptionsOptions,
  PreviewSubscriptionUpdateInput,
  ProrationPreviewResult,
} from "@/types/subscriptions";

/**
 * Interface for Recurring Billing operations.
 * Manages the lifecycle of subscriptions (Start, Stop, Pause, Resume).
 */
export interface ISubscriptionFeature {
  /**
   * Creates a new recurring subscription.
   * Usually involves setting up a billing schedule and charging the first period.
   *
   * @param ctx - The execution context.
   * @param input - Customer ID, Price/Plan ID, and trial configuration.
   */
  createSubscription(
    ctx: ProviderContext,
    input: CreateSubscriptionInput,
  ): Promise<AsyncActionResult<string>>;

  /**
   * Cancels an active subscription.
   *
   * Standard behavior should be `cancel_at_period_end` to avoid pro-ration issues,
   * unless immediate cancellation is explicitly required by logic.
   *
   * @param ctx - The execution context.
   * @param id - The Subscription ID.
   * @param reason - Optional reason for churn analysis (e.g., "too_expensive").
   */
  cancelSubscription(
    ctx: ProviderContext,
    input: CancelSubscriptionInput,
  ): Promise<AsyncActionResult<string>>;

  /**
   * Temporarily halts billing and service access without deleting the subscription.
   * Used for "keep-your-data" flows.
   *
   * @param ctx - The execution context.
   * @param id - The Subscription ID.
   */
  pauseSubscription(
    ctx: ProviderContext,
    input: PauseSubscriptionInput,
  ): Promise<AsyncActionResult<string>>;

  /**
   * Reactivates a paused subscription, resuming the billing cycle.
   *
   * @param ctx - The execution context.
   * @param id - The Subscription ID.
   */
  resumeSubscription(
    ctx: ProviderContext,
    input: ResumeSubscriptionInput,
  ): Promise<AsyncActionResult<string>>;

  /**
   * Retrieves the latest state of a subscription.
   *
   * @param ctx - The execution context.
   * @param id - The Subscription ID.
   */
  getSubscription(
    ctx: ProviderContext,
    input: GetSubscriptionInput,
  ): Promise<AsyncActionResult<Subscription>>;

  /**
   * Lists subscriptions with pagination.
   */
  listSubscriptions?(
    ctx: ProviderContext,
    options: ListSubscriptionsOptions,
  ): Promise<AsyncActionResult<PaginatedResult<Subscription>>>;

  /**
   * Updates an existing subscription (e.g., upgrade/downgrade plan, change quantity).
   *
   * @param ctx - The execution context.
   * @param id - The Subscription ID.
   * @param input - Fields to update.
   */
  updateSubscription?(
    ctx: ProviderContext,
    input: UpdateSubscriptionInput,
  ): Promise<AsyncActionResult<string>>;

  /**
   * Calculates the exact pro-rated cost of upgrading or downgrading a subscription
   * before actually processing the change.
   * * @param ctx - The provider execution context.
   * @param input - The target subscription details and the new items to be applied.
   * @returns An AsyncActionResult containing the immediate charge amount and the new recurring total.
   */
  previewSubscriptionUpdate?(
    ctx: ProviderContext,
    input: PreviewSubscriptionUpdateInput,
  ): Promise<AsyncActionResult<ProrationPreviewResult>>;
}
