import {
  FEATURE_TYPES,
  UNIT_TYPES,
  RESET_PERIODS,
  BILLING_INTERVALS,
  PLAN_TYPES,
  STATUSES,
  SUBSCRIPTION_STATUSES,
  PRICING_TYPES,
  ADDON_ENTITLEMENT_TYPES,
  CHECK_RESULT_REASONS,
} from "@/constants";
import { AddonEntitlementType } from "@/domain/aggregates";

// ==========================================
// 1. Enums & Primitives
// ==========================================

export type FeatureType = (typeof FEATURE_TYPES)[number];
export type UnitType = (typeof UNIT_TYPES)[number];
export type ResetPeriod = (typeof RESET_PERIODS)[number];
export type BillingInterval = (typeof BILLING_INTERVALS)[number];
export type PlanType = (typeof PLAN_TYPES)[number];
export type PlanStatus = (typeof STATUSES)[number];
export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUSES)[number];
export type PricingType = (typeof PRICING_TYPES)[number];
export type CheckResultReason = (typeof CHECK_RESULT_REASONS)[number];

// ==========================================
// 2. Feature Definitions (Entitlements)
// ==========================================

export interface FeatureDef {
  slug: string;
  name: string;
  description?: string;
  type: FeatureType;
  unit_type: UnitType;
}

export type FeatureDefInput = Omit<FeatureDef, "slug">;

// ==========================================
// 3. Plan Feature Values (Plan Entitlements)
// ==========================================

export interface PlanFeatureValue {
  value_limit?: number;
  value_bool?: boolean;
  value_text?: string;
  is_hard_limit?: boolean;
  reset_period?: ResetPeriod;
}

export interface AddonFeatureValue {
  value_limit?: number;
  type?: AddonEntitlementType;
  has_access?: boolean;
  is_hard_limit?: boolean;
}

// ==========================================
// 4. Pricing
// ==========================================

export interface PriceDef {
  amount: number;
  currency: string;
  billing_interval?: BillingInterval;
  interval_count?: number;
  type?: PricingType;
  trial_period_days?: number;
  is_active?: boolean;
  overage_configuration?: Record<
    string,
    {
      overage_amount: number;
      overage_unit: number;
    }
  >;
  available_addons?: string[];
}

// ==========================================
// 5. Plans
// ==========================================

export interface PlanDef {
  slug: string;
  name: string;
  description?: string;
  is_default: boolean;
  is_public: boolean;
  type: PlanType;
  status: PlanStatus;
  prices?: PriceDef[];
  features: Record<string, PlanFeatureValue>;
}

export type PlanDefInput = Omit<PlanDef, "slug" | "status" | "features"> & {
  status?: PlanStatus;
  features: Record<string, PlanFeatureValue>;
};

// ==========================================
// 6. Add-ons
// ==========================================

export interface AddonDef {
  slug: string;
  name: string;
  description?: string;
  type: PricingType;
  amount: number;
  currency: string;
  billing_interval?: BillingInterval;
  interval_count?: number;
  features: Record<string, AddonFeatureValue>;
}

export type AddonDefInput = Omit<AddonDef, "slug">;

// ==========================================
// 7. Discounts & Coupons
// ==========================================

export type DiscountType = "percent" | "amount";
export type DiscountDuration = "once" | "forever" | "repeating";

export interface DiscountBase {
  code: string;
  name?: string;
  applies_to_plans?: string[];
  max_redemptions?: number;
  expires_at?: string;
}

export type DiscountValueDef =
  | { type: "percent"; value: number }
  | { type: "amount"; value: number };

export type DiscountDurationDef =
  | { duration: "once" | "forever"; duration_in_months?: never }
  | { duration: "repeating"; duration_in_months: number };

export type DiscountDef = DiscountBase & DiscountValueDef & DiscountDurationDef;

// ==========================================
// 8. Engine Output
// ==========================================

export interface CheckResult {
  allowed: boolean;
  reason?: CheckResultReason;
  remaining?: number;
  cost_estimate?: number;
  granted_by?: string[];
}

// ==========================================
// 9. Config Root
// ==========================================

export interface RevstackConfig {
  features: Record<string, FeatureDefInput>;
  plans: Record<string, PlanDefInput>;
  addons?: Record<string, AddonDefInput>;
  coupons?: DiscountDef[];
}
