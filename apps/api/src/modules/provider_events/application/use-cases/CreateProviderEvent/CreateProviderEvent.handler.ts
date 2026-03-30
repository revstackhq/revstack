import type { ProviderEventRepository } from "@/modules/provider_events/application/ports/ProviderEventRepository";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { CreateProviderEventCommand } from "./CreateProviderEvent.schema";
import { ProviderEventEntity } from "@/modules/provider_events/domain/ProviderEventEntity";

export class CreateProviderEventHandler {
  constructor(
    private readonly repository: ProviderEventRepository,
    private readonly eventBus: EventBus
  ) {}

  public async execute(command: CreateProviderEventCommand) {
    const event = ProviderEventEntity.ingest(
      command.providerId,
      command.externalEventId,
      command.eventType,
      command.payload
    );

    await this.repository.save(event);
    
    // Publish a cross-domain event so the matching infrastructure listener (e.g. Inngest) can process it.
    await this.eventBus.publish({ 
      eventName: "provider.event_received", 
      eventId: event.id,
      providerId: event.providerId,
      type: event.eventType
    });

    return { id: event.id, status: event.status };
  }
}
