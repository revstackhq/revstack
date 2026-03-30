import type { ProviderEventRepository } from "@/modules/provider_events/application/ports/ProviderEventRepository";
import type { ListProviderEventsQuery } from "./ListProviderEvents.schema";

export class ListProviderEventsHandler {
  constructor(private readonly repository: ProviderEventRepository) {}

  public async execute(query: ListProviderEventsQuery) {
    return this.repository.find({
      providerId: query.providerId,
      status: query.status,
      eventType: query.eventType,
    });
  }
}
