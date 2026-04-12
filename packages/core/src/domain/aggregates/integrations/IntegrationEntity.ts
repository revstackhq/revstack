import { Entity } from "@/domain/base/Entity";
import { generateId } from "@/utils/id";
import {
  IntegrationInstalledEvent,
  IntegrationUpdatedEvent,
  IntegrationUninstalledEvent,
  IntegrationConfigUpdatedEvent,
} from "./IntegrationEvents";
import {
  IntegrationProviderRequiredError,
  IntegrationAlreadyInactiveError,
} from "./IntegrationErrors";

export type IntegrationStatus = "active" | "inactive" | "error";
export type IntegrationMode = "test" | "live";

export interface IntegrationProps {
  id: string;
  environmentId: string;
  provider: string;
  status: IntegrationStatus;
  mode: IntegrationMode;
  config: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateIntegrationProps = Omit<
  IntegrationProps,
  "id" | "status" | "createdAt" | "updatedAt"
>;

export type UpdateIntegrationProps = Partial<
  Pick<IntegrationProps, "status" | "config" | "mode">
>;

export class IntegrationEntity extends Entity<IntegrationProps> {
  private constructor(props: IntegrationProps) {
    super(props);
  }

  public static restore(props: IntegrationProps): IntegrationEntity {
    return new IntegrationEntity(props);
  }

  public static create(props: CreateIntegrationProps): IntegrationEntity {
    if (!props.provider) {
      throw new IntegrationProviderRequiredError();
    }

    const integration = new IntegrationEntity({
      ...props,
      id: generateId("int"),
      status: "active",
      config: props.config ?? {},
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    integration.addEvent(
      new IntegrationInstalledEvent({
        integrationId: integration.val.id,
        environmentId: integration.val.environmentId,
        provider: integration.val.provider,
      }),
    );

    return integration;
  }

  public update(props: UpdateIntegrationProps): void {
    let changed = false;

    if (props.status !== undefined && props.status !== this.props.status) {
      this.props.status = props.status;
      changed = true;
    }

    if (props.mode !== undefined && props.mode !== this.props.mode) {
      this.props.mode = props.mode;
      changed = true;
    }

    if (props.config !== undefined) {
      this.props.config = { ...this.props.config, ...props.config };
      this.props.updatedAt = new Date();

      this.addEvent(
        new IntegrationConfigUpdatedEvent({
          integrationId: this.val.id,
          environmentId: this.val.environmentId,
        }),
      );
      return;
    }

    if (changed) {
      this.props.updatedAt = new Date();
      this.addEvent(
        new IntegrationUpdatedEvent({
          integrationId: this.val.id,
          environmentId: this.val.environmentId,
          status: this.props.status,
          mode: this.props.mode,
        }),
      );
    }
  }

  public uninstall(): void {
    if (this.props.status === "inactive") {
      throw new IntegrationAlreadyInactiveError(this.val.id);
    }

    this.props.status = "inactive";
    this.props.updatedAt = new Date();

    this.addEvent(
      new IntegrationUninstalledEvent({
        integrationId: this.val.id,
        environmentId: this.val.environmentId,
        provider: this.val.provider,
      }),
    );
  }

  public get isLive(): boolean {
    return this.props.mode === "live";
  }

  public get provider(): string {
    return this.props.provider;
  }
}
