import { DomainError } from "@/common/errors/DomainError";

export class PriceNotFoundError extends DomainError {
  constructor() {
    super("Price not found", 404, "PRICE_NOT_FOUND");
  }
}
