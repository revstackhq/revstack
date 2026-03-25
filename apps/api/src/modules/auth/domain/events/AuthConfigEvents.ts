export class AuthConfigUpdatedEvent {
  public readonly eventName = "auth_config.updated";
  constructor(public readonly configId: string, public readonly environmentId: string) {}
}
