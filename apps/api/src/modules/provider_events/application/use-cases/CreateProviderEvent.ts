import { z } from "zod";
import type { ProviderEventRepository } from "@revstackhq/core";
import type { EventBus } from "@/common/application/ports/EventBus";
import { ProviderEventEntity } from "@revstackhq/core";

export const createProviderEventSchema = z.object({
  providerId: z.string(),
  externalEventId: z.string(),
  eventType: z.string(),
  payload: z.record(z.any()),
});

export type CreateProviderEventCommand = z.infer<typeof createProviderEventSchema>;

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
