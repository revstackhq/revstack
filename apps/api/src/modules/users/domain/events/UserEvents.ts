export class UserCreatedEvent {
  public readonly eventName = "user.created";
  constructor(public readonly userId: string, public readonly environmentId: string) {}
}

export class UserUpdatedEvent {
  public readonly eventName = "user.updated";
  constructor(public readonly userId: string, public readonly environmentId: string) {}
}
