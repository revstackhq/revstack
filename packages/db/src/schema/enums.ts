import { BILLING_INTERVALS } from "@revstackhq/core";
import { revstack } from "./namespace";

export const billingIntervalEnum = revstack.enum(
  "billing_interval",
  BILLING_INTERVALS,
);
