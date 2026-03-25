export class EnvironmentCreatedEvent {
  public readonly eventName = "environment.created";
  constructor(public readonly environmentId: string, public readonly projectId: string) {}
}

export class EnvironmentDeletedEvent {
  public readonly eventName = "environment.deleted";
  constructor(public readonly environmentId: string) {}
}
