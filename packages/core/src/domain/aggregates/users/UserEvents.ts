import { DOMAIN_EVENTS } from "@/constants/index";

export class UserCreatedEvent {
  public readonly eventName = DOMAIN_EVENTS.USER_CREATED;
  constructor(public readonly userId: string, public readonly environmentId: string) {}
}

export class UserUpdatedEvent {
  public readonly eventName = DOMAIN_EVENTS.USER_UPDATED;
  constructor(public readonly userId: string, public readonly environmentId: string) {}
}
