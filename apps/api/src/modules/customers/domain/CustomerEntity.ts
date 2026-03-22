export class CustomerEntity {
  constructor(
    public readonly id: string,
    public email: string,
    public name?: string,
    public providerId?: string,
    public isActive: boolean = true
  ) {}

  public static create(email: string, name?: string, providerId?: string): CustomerEntity {
    return new CustomerEntity(crypto.randomUUID(), email, name, providerId, true);
  }

  public deactivate(): void {
    if (!this.isActive) {
      throw new Error("CustomerAlreadyDeactivated");
    }
    this.isActive = false;
  }
}
