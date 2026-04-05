export class CustomerNotFoundError extends Error {
  constructor(id: string) {
    super(`Customer with ID ${id} was not found.`);
    this.name = "CustomerNotFoundError";
  }
}

export class CustomerAlreadyDeactivatedError extends Error {
  constructor(id: string) {
    super(`Customer with ID ${id} is already deactivated.`);
    this.name = "CustomerAlreadyDeactivatedError";
  }
}
