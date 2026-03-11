import {
  AsyncActionResult,
  ProviderContext,
  RevstackErrorCode,
  DeletePaymentMethodInput,
} from "@revstackhq/providers-core";

const NOT_IMPLEMENTED = {
  status: "failed" as const,
  error: {
    code: RevstackErrorCode.NotImplemented,
    message: "Payment methods management is natively not supported by Polar",
  },
};

export const deletePaymentMethod = async (
  _ctx: ProviderContext,
  _input: DeletePaymentMethodInput,
): Promise<AsyncActionResult<boolean>> => {
  return { ...NOT_IMPLEMENTED, data: false };
};
