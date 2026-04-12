import { BadRequestError } from "@/domain/base/DomainError";

export class InvoiceDomainError extends BadRequestError {
  constructor(message: string, code: string) {
    super(message, code);
    this.name = "InvoiceDomainError";
  }
}

export class InvalidInvoiceStateError extends InvoiceDomainError {
  constructor(id: string, currentStatus: string) {
    super(
      `Invoice ${id} cannot be modified in its current state: ${currentStatus}.`,
      "INVALID_INVOICE_STATE",
    );
  }
}

export class InvalidInvoiceAmountError extends InvoiceDomainError {
  constructor(message: string = "Invoice amount must be greater than zero.") {
    super(message, "INVALID_INVOICE_AMOUNT");
  }
}
