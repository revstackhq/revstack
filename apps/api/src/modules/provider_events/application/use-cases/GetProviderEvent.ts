import type { ProviderEventRepository } from "@revstackhq/core";
import { NotFoundError } from "@revstackhq/core";

export interface GetProviderEventQuery {
  id: string;
}

export class GetProviderEventHandler {
  constructor(private readonly repository: ProviderEventRepository) {}

  public async execute(query: GetProviderEventQuery) {
    const event = await this.repository.findById(query.id);
    if (!event) {
      throw new NotFoundError("Provider event not found", "PROVIDER_EVENT_NOT_FOUND");
    }
    return event;
  }
}
