import { generateId } from "@/utils/id";
import {
  AddonNotFoundError,
  InvalidAddonQuantityError,
  InvalidSubscriptionStatusError,
} from "./SubscriptionErrors";
import type {
  SubscriptionAddon,
  SubscriptionStatus,
} from "./SubscriptionEntity";

export interface AddAddonInput {
  addonId: string;
  unitAmount: number;
  quantity: number;
}

export interface AddAddonContext {
  action: string;
  status: SubscriptionStatus;
  isPendingPayment: boolean;
  addons: SubscriptionAddon[];
}

export interface AddAddonResult {
  addons: SubscriptionAddon[];
  addedQuantity: number;
}

export interface RemoveAddonInput {
  addonId: string;
}

export interface RemoveAddonContext {
  addons: SubscriptionAddon[];
}

export interface RemoveAddonResult {
  addons: SubscriptionAddon[];
}

export class SubscriptionAddonManager {
  public add(input: AddAddonInput, context: AddAddonContext): AddAddonResult {
    if (input.quantity <= 0) {
      throw new InvalidAddonQuantityError(input.quantity);
    }

    if (context.isPendingPayment) {
      throw new InvalidSubscriptionStatusError(
        context.action,
        context.status,
        "Settle pending invoices first",
      );
    }

    const existing = context.addons.find((a) => a.addonId === input.addonId);

    if (existing) {
      const nextAddons = context.addons.map((addon) =>
        addon.addonId === input.addonId
          ? { ...addon, quantity: addon.quantity + input.quantity }
          : addon,
      );

      return { addons: nextAddons, addedQuantity: input.quantity };
    }

    const nextAddons = [
      ...context.addons,
      {
        id: generateId("sadd"),
        addonId: input.addonId,
        quantity: input.quantity,
        unitAmount: input.unitAmount,
      },
    ];

    return { addons: nextAddons, addedQuantity: input.quantity };
  }

  public remove(
    input: RemoveAddonInput,
    context: RemoveAddonContext,
  ): RemoveAddonResult {
    const exists = context.addons.some((a) => a.addonId === input.addonId);
    if (!exists) throw new AddonNotFoundError(input.addonId);

    const nextAddons = context.addons.filter(
      (addon) => addon.addonId !== input.addonId,
    );

    return { addons: nextAddons };
  }
}
