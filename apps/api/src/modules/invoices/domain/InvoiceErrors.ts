export class InvoiceNotFoundError extends Error {
  constructor(id: string) {
    super(`Invoice with ID ${id} was not found.`);
    this.name = "InvoiceNotFoundError";
  }
}

export class PaymentNotFoundError extends Error {
  constructor(id: string) {
    super(`Payment with ID ${id} was not found.`);
    this.name = "PaymentNotFoundError";
  }
}
