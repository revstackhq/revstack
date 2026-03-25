export class StudioAdminCreatedEvent {
  public readonly eventName = "studio.admin.created";
  constructor(public readonly adminId: string, public readonly email: string) {}
}
