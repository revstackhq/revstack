import { Entity } from "@/domain/base/Entity";

export interface IntegrationProps {
  id?: string;
  providerId: string;
  status: "installed" | "uninstalled" | "error";
  config: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export class IntegrationEntity extends Entity<IntegrationProps> {
  private constructor(props: IntegrationProps) {
    super(props);
  }

  public static restore(props: IntegrationProps): IntegrationEntity {
    return new IntegrationEntity(props);
  }

  public static install(
    providerId: string,
    initialConfig: Record<string, any>,
  ): IntegrationEntity {
    return new IntegrationEntity({
      providerId,
      status: "installed",
      config: initialConfig,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public updateConfig(newConfig: Record<string, any>): void {
    if (this.props.status !== "installed") {
      throw new Error("CannotUpdateUninstalledIntegration");
    }
    this.props.config = { ...this.props.config, ...newConfig };
    this.props.updatedAt = new Date();
  }

  public uninstall(): void {
    this.props.status = "uninstalled";
    this.props.updatedAt = new Date();
  }
}
