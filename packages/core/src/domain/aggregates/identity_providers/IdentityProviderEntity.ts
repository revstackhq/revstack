import { Entity } from "@/domain/base/Entity";
import { generateId } from "@/utils/id";
import {
  MissingConfigurationError,
  InvalidStrategyChangeError,
} from "./IdentityProviderErrors";
import {
  IdentityProviderCreatedEvent,
  IdentityProviderUpdatedEvent,
} from "./IdentityProviderEvents";

export type ExternalAuthProvider =
  | "auth0"
  | "clerk"
  | "supabase"
  | "cognito"
  | "firebase"
  | "kinde"
  | "workos"
  | "keycloak"
  | "oidc"
  | "custom";

export type SigningStrategy = "HS256" | "RS256";
export type IdentityProviderStatus =
  | "active"
  | "inactive"
  | "archived"
  | "draft";

export interface IdentityProviderProps {
  id: string;
  environmentId: string;
  vendor: ExternalAuthProvider;
  strategy: SigningStrategy;
  jwksUri: string | null;
  signingSecret: string | null;
  issuer: string | null;
  audience: string | null;
  userIdClaim: string;
  emailClaim: string | null;
  status: IdentityProviderStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateIdentityProviderProps = Omit<
  IdentityProviderProps,
  "id" | "status" | "createdAt" | "updatedAt"
>;

export type UpdateIdentityProviderProps = Partial<
  Omit<
    IdentityProviderProps,
    "id" | "environmentId" | "createdAt" | "updatedAt"
  >
>;

export class IdentityProviderEntity extends Entity<IdentityProviderProps> {
  private constructor(props: IdentityProviderProps) {
    super(props);
  }

  public static restore(props: IdentityProviderProps): IdentityProviderEntity {
    return new IdentityProviderEntity(props);
  }

  public static create(
    props: CreateIdentityProviderProps,
  ): IdentityProviderEntity {
    if (props.strategy === "RS256") {
      if (!props.jwksUri)
        throw new MissingConfigurationError("jwksUri", "RS256");
      if (!props.issuer) throw new MissingConfigurationError("issuer", "RS256");
    }

    if (props.strategy === "HS256" && !props.signingSecret) {
      throw new MissingConfigurationError("signingSecret", "HS256");
    }

    const entity = new IdentityProviderEntity({
      ...props,
      id: generateId("idp"),
      userIdClaim: props.userIdClaim ?? "sub",
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    entity.addEvent(
      new IdentityProviderCreatedEvent({
        id: entity.val.id,
        environmentId: entity.val.environmentId,
        vendor: entity.val.vendor,
      }),
    );

    return entity;
  }

  public update(props: UpdateIdentityProviderProps): void {
    const changes: string[] = [];

    if (props.strategy === "RS256" && !props.jwksUri && !this.props.jwksUri) {
      throw new InvalidStrategyChangeError();
    }

    Object.keys(props).forEach((key) => {
      const k = key as keyof UpdateIdentityProviderProps;
      if (props[k] !== undefined && props[k] !== this.props[k]) {
        (this.props as any)[k] = props[k];
        changes.push(k);
      }
    });

    if (changes.length > 0) {
      this.props.updatedAt = new Date();
      this.addEvent(
        new IdentityProviderUpdatedEvent({
          id: this.val.id,
          environmentId: this.val.environmentId,
          changes,
        }),
      );
    }
  }

  public get validationMode(): "remote" | "local" {
    return this.props.strategy === "RS256" ? "remote" : "local";
  }

  public isActive(): boolean {
    return this.props.status === "active";
  }
}
