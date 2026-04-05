import { Entity } from "@/domain/base/Entity";
import { BadRequestError } from "@/domain/base/DomainError";
import { generateId } from "@/utils/id";
import {
  AddonCreatedEvent,
  AddonArchivedEvent,
} from "@/domain/aggregates/addons/AddonEvents";

import type { PricingType, PlanStatus, BillingInterval } from "@/types/index";

export interface AddonProps {
  id: string;
  environmentId: string;
  slug: string;
  name: string;
  description?: string;
  type: PricingType;
  billingInterval?: BillingInterval;
  billingIntervalCount?: number;
  amount: number;
  currency: string;
  status: PlanStatus;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAddonProps {
  environmentId: string;
  slug: string;
  name: string;
  type: PricingType;
  amount: number;
  description?: string;
  billingInterval?: BillingInterval;
  billingIntervalCount?: number;
  currency?: string;
  metadata?: Record<string, any>;
}

export class AddonEntity extends Entity<AddonProps> {
  private constructor(props: AddonProps) {
    super(props);
  }

  public static restore(props: AddonProps): AddonEntity {
    return new AddonEntity(props);
  }

  public static create(props: CreateAddonProps): AddonEntity {
    if (!props.name) {
      throw new BadRequestError("Addon name is required", "NAME_REQUIRED");
    }

    if (!props.slug) {
      throw new BadRequestError("Addon slug is required", "SLUG_REQUIRED");
    }

    if (!props.type) {
      throw new BadRequestError("Addon type is required", "TYPE_REQUIRED");
    }

    if (props.amount < 0) {
      throw new BadRequestError(
        "Addon amount cannot be negative",
        "INVALID_AMOUNT",
      );
    }

    const id = generateId("add");

    const entity = new AddonEntity({
      ...props,
      id,
      currency: props.currency || "USD",
      status: "active",
      name: props.name,
      slug: props.slug,
      amount: props.amount,
      description: props.description,
      billingInterval: props.billingInterval,
      billingIntervalCount: props.billingIntervalCount,
      type: props.type,
      environmentId: props.environmentId,
      metadata: props.metadata || {},
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    entity.addEvent(
      new AddonCreatedEvent({
        environment_id: props.environmentId,
        id,
        slug: props.slug,
      }),
    );

    return entity;
  }

  public archive(): void {
    if (this.props.status === "archived") {
      throw new BadRequestError(
        "Addon is already archived",
        "ALREADY_ARCHIVED",
      );
    }

    this.props.status = "archived";
    this.props.updatedAt = new Date();

    this.addEvent(
      new AddonArchivedEvent({
        id: this.val.id!,
        environment_id: this.val.environmentId,
      }),
    );
  }
}
