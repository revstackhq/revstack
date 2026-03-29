import { Entity } from "@/common/domain/Entity";
import { BadRequestError } from "@/common/errors/DomainError";

export interface AuthConfigProps {
  id?: string;
  environmentId: string;
  provider: "auth0" | "clerk" | "supabase" | "cognito" | "firebase" | "custom";
  strategy: "HS256" | "RS256";
  jwksUri?: string;
  signingSecret?: string;
  issuer?: string;
  audience?: string;
  userIdClaim: string;
  status: "active" | "inactive" | "archived" | "draft";
  createdAt: Date;
  updatedAt: Date;
}

export class AuthConfigEntity extends Entity<AuthConfigProps> {
  private constructor(props: AuthConfigProps) {
    super(props);
  }

  public static restore(props: AuthConfigProps): AuthConfigEntity {
    return new AuthConfigEntity(props);
  }

  public static create(
    props: Omit<AuthConfigProps, "id" | "status" | "createdAt" | "updatedAt">,
  ): AuthConfigEntity {
    if (!props.environmentId)
      throw new BadRequestError("Environment ID is required", "MISSING_ENV_ID");

    if (!props.userIdClaim)
      throw new BadRequestError(
        "User ID claim is required for token parsing",
        "MISSING_USER_CLAIM",
      );

    if (props.strategy === "RS256" && !props.jwksUri)
      throw new BadRequestError(
        "JWKS URI required for RS256 strategy",
        "MISSING_JWKS_URI",
      );

    if (props.strategy === "RS256" && !props.issuer)
      throw new BadRequestError(
        "Issuer required for RS256 strategy",
        "MISSING_ISSUER",
      );

    if (props.strategy === "HS256" && !props.signingSecret)
      throw new BadRequestError(
        "Signing secret required for HS256 strategy",
        "MISSING_SECRET",
      );

    return new AuthConfigEntity({
      ...props,
      status: "active",
      strategy: props.strategy,
      provider: props.provider,
      userIdClaim: props.userIdClaim,
      environmentId: props.environmentId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public update(
    props: Partial<
      Omit<AuthConfigProps, "id" | "environmentId" | "createdAt" | "updatedAt">
    >,
  ): void {
    if (props.provider) this.props.provider = props.provider;
    if (props.jwksUri !== undefined) this.props.jwksUri = props.jwksUri;
    if (props.signingSecret !== undefined)
      this.props.signingSecret = props.signingSecret;
    if (props.issuer !== undefined) this.props.issuer = props.issuer;
    if (props.audience !== undefined) this.props.audience = props.audience;
    if (props.userIdClaim) this.props.userIdClaim = props.userIdClaim;
    if (props.status) this.props.status = props.status;

    this.props.updatedAt = new Date();
  }
}
