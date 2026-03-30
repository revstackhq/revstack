import type { ProviderEventRepository } from "@/modules/provider_events/application/ports/ProviderEventRepository";
import type { GetProviderEventQuery } from "./GetProviderEvent.schema";
import { NotFoundError } from "@/common/errors/DomainError";

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
