import { DOMAIN_EVENTS } from "@/constants/index";

export class AuthConfigUpdatedEvent {
  public readonly eventName = DOMAIN_EVENTS.AUTH_CONFIG_UPDATED;
  constructor(public readonly configId: string, public readonly environmentId: string) {}
}
