import { Entity } from "@/domain/base/Entity";
import { generateRawApiKey, hashString, verifyHash } from "@/utils/crypto";
import { generateId } from "@/utils/id";
import {
  ApiKeyCreatedEvent,
  ApiKeyRotatedEvent,
  ApiKeyUpdatedEvent,
  ApiKeyRevokedEvent,
} from "@/domain/aggregates/api_keys/ApiKeyEvents";
import {
  ApiKeyRevokedError,
  ApiKeyExpiredError,
  ApiKeyScopeError,
} from "./ApiKeyErrors";

export type ApiKeyType = "public" | "secret";
export type ApiKeyStatus = "active" | "revoked" | "expired";

export interface ApiKeyProps {
  id: string;
  keyHash: string;
  displayKey: string;
  environmentId: string;
  name: string;
  type: ApiKeyType;
  scopes: string[];
  status: ApiKeyStatus;
  expiresAt: Date | null;
  lastUsedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateApiKeyProps = Omit<
  ApiKeyProps,
  | "id"
  | "keyHash"
  | "displayKey"
  | "createdAt"
  | "updatedAt"
  | "status"
  | "lastUsedAt"
>;

export type UpdateApiKeyProps = Partial<
  Pick<ApiKeyProps, "name" | "scopes" | "status" | "expiresAt">
>;

export class ApiKeyEntity extends Entity<ApiKeyProps> {
  private constructor(props: ApiKeyProps) {
    super(props);
  }

  public static restore(props: ApiKeyProps): ApiKeyEntity {
    return new ApiKeyEntity(props);
  }

  public static async create(
    props: CreateApiKeyProps,
  ): Promise<{ entity: ApiKeyEntity; rawKey: string }> {
    const rawKey = generateRawApiKey(props.type);
    const keyHash = await hashString(rawKey);

    const prefix = rawKey.split("_").slice(0, 3).join("_");
    const displayKey = `${prefix}_${"*".repeat(8)}${rawKey.slice(-4)}`;

    const entity = new ApiKeyEntity({
      ...props,
      id: generateId("ak"),
      keyHash,
      displayKey,
      status: "active",
      expiresAt: props.expiresAt ?? null,
      lastUsedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    entity.addEvent(
      new ApiKeyCreatedEvent({
        id: entity.val.id,
        environmentId: entity.val.environmentId,
        type: entity.val.type,
        name: entity.val.name,
      }),
    );

    return { entity, rawKey };
  }

  public async validate(rawKey: string): Promise<boolean> {
    if (!this.isActive()) return false;

    const isValid = await verifyHash(rawKey, this.props.keyHash);

    if (isValid) {
      this.props.lastUsedAt = new Date();
      this.props.updatedAt = new Date();
    }

    return isValid;
  }

  public isActive(): boolean {
    if (this.props.status !== "active") return false;
    if (this.props.expiresAt && new Date() > this.props.expiresAt) {
      return false;
    }
    return true;
  }

  public revoke(): void {
    if (this.props.status === "revoked") {
      throw new ApiKeyRevokedError(this.val.id);
    }
    this.props.status = "revoked";
    this.props.updatedAt = new Date();

    this.addEvent(
      new ApiKeyRevokedEvent({
        id: this.val.id,
        environmentId: this.val.environmentId,
      }),
    );
  }

  public checkAccess(requiredScope: string): void {
    if (!this.isActive()) throw new ApiKeyExpiredError(this.val.id);
    if (!this.hasScope(requiredScope)) {
      throw new ApiKeyScopeError(requiredScope);
    }
  }

  private hasScope(scope: string): boolean {
    return (
      this.props.scopes.includes(scope) ||
      this.props.scopes.includes("admin") ||
      this.props.scopes.includes("*")
    );
  }

  public update(props: UpdateApiKeyProps): void {
    const changes: string[] = [];

    if (props.name && props.name !== this.props.name) {
      this.props.name = props.name;
      changes.push("name");
    }

    if (
      props.scopes &&
      JSON.stringify(props.scopes) !== JSON.stringify(this.props.scopes)
    ) {
      this.props.scopes = props.scopes;
      changes.push("scopes");
    }

    if (props.status && props.status !== this.props.status) {
      this.props.status = props.status;
      changes.push("status");
    }

    if (
      props.expiresAt !== undefined &&
      props.expiresAt !== this.props.expiresAt
    ) {
      this.props.expiresAt = props.expiresAt;
      changes.push("expiresAt");
    }

    if (changes.length > 0) {
      this.props.updatedAt = new Date();
      this.addEvent(
        new ApiKeyUpdatedEvent({
          id: this.val.id,
          environmentId: this.val.environmentId,
          changes,
        }),
      );
    }
  }

  public async rotate(
    actorId: string,
    gracePeriodHours = 24,
  ): Promise<{ newEntity: ApiKeyEntity; newRawKey: string }> {
    const { entity: newEntity, rawKey: newRawKey } = await ApiKeyEntity.create({
      environmentId: this.props.environmentId,
      name: `${this.props.name} (Rotated)`,
      type: this.props.type,
      scopes: [...this.props.scopes],
      expiresAt: null,
    });

    const oldId = this.val.id;
    this.props.name = `${this.props.name} (Legacy - Expiring)`;
    this.props.expiresAt = new Date(
      Date.now() + gracePeriodHours * 60 * 60 * 1000,
    );
    this.props.updatedAt = new Date();

    this.addEvent(
      new ApiKeyRotatedEvent({
        oldId,
        newId: newEntity.val.id,
        environmentId: this.val.environmentId,
        actorId,
      }),
    );

    return { newEntity, newRawKey };
  }
}
