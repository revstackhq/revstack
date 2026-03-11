import {
  PaymentStatus,
  Payment,
  normalizeCurrency,
} from "@revstackhq/providers-core";
import { Order as PolarOrder } from "@polar-sh/sdk/models/components/order.js";

export function mapPolarOrderStatusToPaymentStatus(
  status: string,
): PaymentStatus {
  return status === "paid" ? PaymentStatus.Succeeded : PaymentStatus.Pending;
}

export function mapPolarOrderToPayment(order: PolarOrder): Payment {
  return {
    id: order.id,
    providerId: "polar",
    externalId: order.id,
    amount: order.subtotalAmount || 0,
    amountRefunded: order.refundedAmount || 0,
    currency: normalizeCurrency(order.currency, "uppercase"),
    status: mapPolarOrderStatusToPaymentStatus(order.status),
    customerId: order.customerId,
    createdAt: new Date(order.createdAt).toISOString(),
    raw: order,
  };
}
