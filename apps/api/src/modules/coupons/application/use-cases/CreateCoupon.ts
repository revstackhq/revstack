import { z } from "zod";
import type { CouponRepository } from "@revstackhq/core";
import type { EventBus } from "@/common/application/ports/EventBus";
import { CouponEntity, DomainError } from "@revstackhq/core";

export const CreateCouponCommandSchema = z.object({
  environment_id: z.string().min(1),
  code: z.string().min(1),
  type: z.enum(["percent", "fixed"]),
  amount: z.number().min(0),
  duration: z.enum(["forever", "once", "repeating"]),
  duration_in_months: z.number().min(0).optional(),
  max_redemptions: z.number().min(0).optional(),
  expires_at: z.date().optional(),
  metadata: z.record(z.any()).optional(),
});

export type CreateCouponCommand = z.infer<typeof CreateCouponCommandSchema>;

export const CreateCouponResponseSchema = z.object({
  id: z.string(),
  environment_id: z.string(),
  code: z.string(),
  type: z.string(),
  amount: z.number(),
  status: z.enum(["active", "inactive", "archived"]),
  duration: z.string(),
  duration_in_months: z.number().optional(),
  max_redemptions: z.number().optional(),
  metadata: z.record(z.any()).optional(),
  expires_at: z.date().optional(),
  created_at: z.date(),
  updated_at: z.date(),
});

export type CreateCouponResponse = z.infer<typeof CreateCouponResponseSchema>;

export class CreateCouponHandler {
  constructor(
    private readonly repository: CouponRepository,
    private readonly eventBus: EventBus,
  ) {}

  public async execute(
    command: CreateCouponCommand,
  ): Promise<CreateCouponResponse> {
    const existing = await this.repository.findByCode(
      command.environment_id,
      command.code,
    );
    if (existing) {
      throw new DomainError(
        "Coupon with this code already exists",
        409,
        "COUPON_ALREADY_EXISTS",
      );
    }

    const coupon = CouponEntity.create({
      environmentId: command.environment_id,
      code: command.code,
      type: command.type,
      amount: command.amount,
      metadata: command.metadata,
      duration: command.duration,
      durationInMonths: command.duration_in_months,
      maxRedemptions: command.max_redemptions,
      expiresAt: command.expires_at,
    });

    await this.repository.save(coupon);

    await this.eventBus.publish(coupon.pullEvents());

    const v = coupon.val;

    return {
      id: v.id,
      environment_id: v.environmentId,
      code: v.code,
      type: v.type,
      amount: v.amount,
      duration: v.duration,
      duration_in_months: v.durationInMonths,
      max_redemptions: v.maxRedemptions,
      status: v.status,
      metadata: v.metadata,
      expires_at: v.expiresAt,
      created_at: v.createdAt,
      updated_at: v.updatedAt,
    };
  }
}
