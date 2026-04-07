import { Entity } from "@/domain/base/Entity";
import { generateId } from "@/utils/id";
import type { EntitlementEntity } from "@/domain/aggregates/entitlements/EntitlementEntity";
import {
  AddonCreatedEvent,
  AddonArchivedEvent,
  AddonEntitlementCreatedEvent,
  AddonEntitlementDeletedEvent,
} from "@/domain/aggregates/addons/AddonEvents";
import {
  AddonAlreadyArchivedError,
  InvalidEntitlementTypeError,
  EntitlementNotFoundError,
} from "@/domain/aggregates/addons/AddonErrors";
import { BadRequestError } from "@/domain/base";

export type AddonType = "recurring" | "one_time";
export type AddonBillingInterval = "day" | "week" | "month" | "year";
export type AddonStatus = "active" | "inactive" | "archived" | "draft";
export type AddonEntitlementType = "increment" | "set";

export interface AddonEntitlementProps {
  id: string;
  entitlementId: string;
  valueLimit?: number;
  type: AddonEntitlementType;
}

export interface AddonProps {
  id: string;
  environmentId: string;
  name: string;
  slug: string;
  type: AddonType;
  description?: string;
  billingInterval?: AddonBillingInterval;
  billingIntervalCount?: number;
  amount: number;
  currency: string;
  status: AddonStatus;
  metadata: Record<string, unknown>;
  entitlements: AddonEntitlementProps[];
  createdAt: Date;
  updatedAt: Date;
}

export type CreateAddonProps = Omit<
  AddonProps,
  "id" | "status" | "entitlements" | "createdAt" | "updatedAt" | "metadata"
> & { metadata?: Record<string, unknown> };

export type UpdateAddonProps = Partial<
  Pick<AddonProps, "name" | "status" | "metadata" | "description">
>;

export class AddonEntity extends Entity<AddonProps> {
  private constructor(props: AddonProps) {
    super(props);
  }

  public static restore(props: AddonProps): AddonEntity {
    return new AddonEntity(props);
  }

  public static create(props: CreateAddonProps): AddonEntity {
    const entity = new AddonEntity({
      ...props,
      id: generateId("add"),
      status: "active",
      entitlements: [],
      metadata: props.metadata || {},
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    entity.addEvent(
      new AddonCreatedEvent({
        id: entity.val.id,
        environmentId: entity.val.environmentId,
        slug: entity.val.slug,
      }),
    );

    return entity;
  }

  public update(props: UpdateAddonProps): void {
    if (props.name !== undefined) {
      this.props.name = props.name;
    }

    if (props.status !== undefined) {
      this.props.status = props.status;
    }

    if (props.metadata !== undefined) {
      this.props.metadata = { ...this.props.metadata, ...props.metadata };
    }

    if (props.description !== undefined) {
      this.props.description = props.description;
    }

    this.props.updatedAt = new Date();
  }

  public archive(): void {
    if (this.props.status === "archived") {
      throw new BadRequestError(
        "Addon is already archived",
        "ADDON_ALREADY_ARCHIVED",
      );
    }

    this.props.status = "archived";
    this.props.updatedAt = new Date();

    this.addEvent(
      new AddonArchivedEvent({
        id: this.val.id,
        environmentId: this.val.environmentId,
      }),
    );
  }

  public addEntitlement(
    entitlement: EntitlementEntity,
    limit: number,
    type: AddonEntitlementType,
  ): void {
    if (entitlement.val.type === "boolean" && type === "increment") {
      throw new InvalidEntitlementTypeError(entitlement.val.slug);
    }

    const entitlementId = entitlement.val.id;

    const newAddonEntitlement: AddonEntitlementProps = {
      id: generateId("aent"),
      entitlementId,
      valueLimit: limit,
      type,
    };

    const existingIndex = this.props.entitlements.findIndex(
      (e) => e.entitlementId === entitlementId,
    );

    if (existingIndex >= 0) {
      this.props.entitlements[existingIndex] = newAddonEntitlement;
    } else {
      this.props.entitlements.push(newAddonEntitlement);
    }

    this.props.updatedAt = new Date();

    this.addEvent(
      new AddonEntitlementCreatedEvent({
        addonId: this.val.id,
        entitlementId: entitlementId,
      }),
    );
  }

  public removeEntitlement(entitlementId: string): void {
    const existingIndex = this.props.entitlements.findIndex(
      (e) => e.entitlementId === entitlementId,
    );

    if (existingIndex === -1) {
      throw new EntitlementNotFoundError(entitlementId);
    }

    this.props.entitlements.splice(existingIndex, 1);
    this.props.updatedAt = new Date();

    this.addEvent(
      new AddonEntitlementDeletedEvent({
        addonId: this.val.id,
        entitlementId: entitlementId,
      }),
    );
  }
}
