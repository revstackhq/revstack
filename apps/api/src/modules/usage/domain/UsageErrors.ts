export class UsageMeterNotFoundError extends Error {
  constructor(customerId: string, featureId: string) {
    super(`Usage meter for customer ${customerId} and feature ${featureId} not found.`);
    this.name = "UsageMeterNotFoundError";
  }
}
