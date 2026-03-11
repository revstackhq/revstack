import {
  AsyncActionResult,
  PaymentMethod,
  ProviderContext,
  RevstackErrorCode,
  ListPaymentMethodsOptions,
} from "@revstackhq/providers-core";

const NOT_IMPLEMENTED = {
  status: "failed" as const,
  error: {
    code: RevstackErrorCode.NotImplemented,
    message: "Payment methods management is natively not supported by Polar",
  },
};

export const listPaymentMethods = async (
  _ctx: ProviderContext,
  _options: ListPaymentMethodsOptions,
): Promise<AsyncActionResult<PaymentMethod[]>> => {
  return { ...NOT_IMPLEMENTED, data: null };
};
