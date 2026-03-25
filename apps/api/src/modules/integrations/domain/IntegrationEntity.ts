export class IntegrationEntity {
  constructor(
    public readonly id: string,
    public providerId: string,
    public status: "installed" | "uninstalled" | "error",
    public config: Record<string, any>,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  public static install(providerId: string, initialConfig: Record<string, any>): IntegrationEntity {
    return new IntegrationEntity(crypto.randomUUID(), providerId, "installed", initialConfig);
  }

  public updateConfig(newConfig: Record<string, any>): void {
    if (this.status !== "installed") {
      throw new Error("CannotUpdateUninstalledIntegration");
    }
    this.config = { ...this.config, ...newConfig };
    this.updatedAt = new Date();
  }

  public uninstall(): void {
    this.status = "uninstalled";
    this.updatedAt = new Date();
  }
}
