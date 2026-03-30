import { DomainEvent } from "@/common/domain/events/DomainEvent";

export interface AddonCreatedPayload {
  environment_id: string;
}

export class AddonCreatedEvent extends DomainEvent<AddonCreatedPayload> {
  public readonly eventName = "addon.created";
  constructor(payload: AddonCreatedPayload) {
    super(payload);
  }
}

export interface AddonArchivedPayload {
  id: string;
  environment_id: string;
}

export class AddonArchivedEvent extends DomainEvent<AddonArchivedPayload> {
  public readonly eventName = "addon.archived";
  constructor(payload: AddonArchivedPayload) {
    super(payload);
  }
}
