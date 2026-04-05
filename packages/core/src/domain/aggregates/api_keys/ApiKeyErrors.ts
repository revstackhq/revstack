export class ApiKeyNotFoundError extends Error {
  constructor() {
    super(`Current API Key is invalid or not found.`);
    this.name = "ApiKeyNotFoundError";
  }
}
