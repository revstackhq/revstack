import { DOMAIN_EVENTS } from "@/constants/index";
import { DomainEvent } from "@/domain/base";

interface WorkspaceMemberCreatedEventPayload {
  id: string;
  email: string;
}

export class WorkspaceMemberCreatedEvent extends DomainEvent<WorkspaceMemberCreatedEventPayload> {
  public readonly eventName = DOMAIN_EVENTS.WORKSPACE_MEMBER_CREATED;

  constructor(payload: WorkspaceMemberCreatedEventPayload) {
    super(payload);
  }
}
