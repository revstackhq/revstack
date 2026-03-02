import {
  AsyncActionResult,
  CheckoutSessionResult,
  PaymentMethod,
  ProviderContext,
  RevstackErrorCode,
  SetupPaymentMethodInput,
} from "@revstackhq/providers-core";

const NOT_IMPLEMENTED = {
  status: "failed" as const,
  error: {
    code: RevstackErrorCode.NotImplemented,
    message: "Payment methods management is natively not supported by Polar",
  },
};

export const setupPaymentMethod = async (
  _ctx: ProviderContext,
  _input: SetupPaymentMethodInput,
): Promise<AsyncActionResult<CheckoutSessionResult>> => {
  return { ...NOT_IMPLEMENTED, data: null };
};

export const listPaymentMethods = async (
  _ctx: ProviderContext,
  _customerId: string,
): Promise<AsyncActionResult<PaymentMethod[]>> => {
  return { ...NOT_IMPLEMENTED, data: null };
};

export const deletePaymentMethod = async (
  _ctx: ProviderContext,
  _id: string,
): Promise<AsyncActionResult<boolean>> => {
  return { ...NOT_IMPLEMENTED, data: false };
};
