export class InvoiceNotFoundError extends Error {
  constructor(id: string) {
    super(`Invoice with ID ${id} was not found.`);
    this.name = "InvoiceNotFoundError";
  }
}

export class InvalidInvoiceStateError extends Error {
  constructor(id: string, currentStatus: string) {
    super(`Invoice ${id} cannot be modified in its current state: ${currentStatus}.`);
    this.name = "InvalidInvoiceStateError";
  }
}
