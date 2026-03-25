import { BadRequestError } from "@/common/errors/DomainError";

export interface ApiKeyProps {
  id: string;
  environmentId: string;
  keyPrefix: string;
  keyHash: string;
  name: string;
  type: "public" | "secret";
  scopes: string[];
  isActive: boolean;
  createdAt: Date;
}

export class ApiKeyEntity {
  private constructor(private readonly props: ApiKeyProps) {}

  get id() {
    return this.props.id;
  }
  get environmentId() {
    return this.props.environmentId;
  }
  get keyPrefix() {
    return this.props.keyPrefix;
  }
  get keyHash() {
    return this.props.keyHash;
  }
  get name() {
    return this.props.name;
  }
  get type() {
    return this.props.type;
  }
  get scopes() {
    return this.props.scopes;
  }
  get isActive() {
    return this.props.isActive;
  }
  get createdAt() {
    return this.props.createdAt;
  }

  public static restore(props: ApiKeyProps): ApiKeyEntity {
    return new ApiKeyEntity(props);
  }

  public static create(
    props: Omit<
      ApiKeyProps,
      "id" | "keyPrefix" | "keyHash" | "isActive" | "createdAt"
    >,
  ): { entity: ApiKeyEntity; rawKey: string } {
    if (!props.environmentId) {
      throw new BadRequestError("Environment ID is required", "MISSING_ENV_ID");
    }
    if (!props.name) {
      throw new BadRequestError("API Key name is required", "MISSING_NAME");
    }

    const rawKey = `rvstk_${props.type}_${crypto.randomUUID().replace(/-/g, "")}`;
    const keyPrefix = rawKey.substring(0, 15);
    const keyHash = `hashed_${rawKey}`;

    const entity = new ApiKeyEntity({
      ...props,
      id: crypto.randomUUID(),
      keyPrefix,
      keyHash,
      isActive: true,
      createdAt: new Date(),
    });

    return { entity, rawKey };
  }

  public update(name?: string, scopes?: string[]): void {
    if (name !== undefined) this.props.name = name;
    if (scopes !== undefined) this.props.scopes = scopes;
  }

  public revoke(): void {
    if (!this.isActive) {
      throw new BadRequestError("ApiKeyAlreadyRevoked", "ALREADY_REVOKED");
    }
    this.props.isActive = false;
  }

  public toPrimitives(): ApiKeyProps {
    return { ...this.props };
  }
}
