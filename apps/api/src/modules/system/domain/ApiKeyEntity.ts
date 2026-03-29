import { Entity } from "@/common/domain/Entity";
import { generateRawApiKey, hashString } from "@/common/utils/crypto";
import {
  ApiKeyCreatedEvent,
  ApiKeyRotatedEvent,
  ApiKeyUpdatedEvent,
} from "@/modules/system/domain/events/ApiKeyEvents";

export interface ApiKeyProps {
  id?: string;
  keyHash: string;
  displayKey: string;
  environmentId: string;
  name: string;
  type: "public" | "secret";
  scopes: string[];
  createdAt: Date;
}

export class ApiKeyEntity extends Entity<ApiKeyProps> {
  private constructor(props: ApiKeyProps) {
    super(props);
  }

  public static restore(props: ApiKeyProps): ApiKeyEntity {
    return new ApiKeyEntity(props);
  }

  public static async create(
    props: Omit<ApiKeyProps, "id" | "keyHash" | "displayKey" | "createdAt">,
  ): Promise<{ entity: ApiKeyEntity; rawKey: string }> {
    const rawKey = generateRawApiKey(props.type);

    const keyHash = await hashString(rawKey);

    const prefix = props.type === "public" ? "rv_pk" : "rv_sk";
    const displayKey = `${prefix}_********${rawKey.slice(-4)}`;

    const entity = new ApiKeyEntity({
      ...props,
      keyHash,
      displayKey,
      createdAt: new Date(),
    });

    entity.addEvent(
      new ApiKeyCreatedEvent({
        key: entity.val.keyHash,
        environmentId: entity.val.environmentId,
      }),
    );

    return { entity, rawKey };
  }

  public async rotate(actorId: string): Promise<string> {
    const newRawKey = generateRawApiKey(this.props.type);

    this.props.keyHash = await hashString(newRawKey);
    this.props.displayKey = `${this.props.type === "public" ? "rv_pk" : "rv_sk"}_********${newRawKey.slice(-4)}`;
    this.props.createdAt = new Date();

    this.addEvent(
      new ApiKeyRotatedEvent({
        key: this.val.keyHash,
        actorId,
        environmentId: this.val.environmentId,
      }),
    );

    return newRawKey;
  }

  public async update(name?: string, scopes?: string[]) {
    if (name) {
      this.props.name = name;
    }
    if (scopes) {
      this.props.scopes = scopes;
    }

    if (!name && !scopes) {
      return;
    }

    this.addEvent(
      new ApiKeyUpdatedEvent({
        key: this.val.keyHash,
        environmentId: this.val.environmentId,
      }),
    );
  }
}
