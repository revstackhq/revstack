export class EntitlementNotFoundError extends Error {
  constructor(id: string) {
    super(`Entitlement with ID ${id} was not found.`);
    this.name = "EntitlementNotFoundError";
  }
}

export class InvalidEntitlementOperationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidEntitlementOperationError";
  }
}
