import { BadRequestError } from "@/common/errors/DomainError";

export interface AuthConfigProps {
  id: string;
  environmentId: string;
  provider: "clerk" | "supabase" | "firebase" | "auth0" | "custom";
  strategy: "jwt" | "jwks";
  jwksUri?: string;
  signingSecret?: string;
  issuer?: string;
  audience?: string;
  userIdClaim: string;
  status: "active" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

export class AuthConfigEntity {
  private constructor(private readonly props: AuthConfigProps) {}

  get id() { return this.props.id; }
  get environmentId() { return this.props.environmentId; }
  get provider() { return this.props.provider; }
  get strategy() { return this.props.strategy; }
  get jwksUri() { return this.props.jwksUri; }
  get signingSecret() { return this.props.signingSecret; }
  get issuer() { return this.props.issuer; }
  get audience() { return this.props.audience; }
  get userIdClaim() { return this.props.userIdClaim; }
  get status() { return this.props.status; }
  get createdAt() { return this.props.createdAt; }
  get updatedAt() { return this.props.updatedAt; }

  public static restore(props: AuthConfigProps): AuthConfigEntity {
    return new AuthConfigEntity(props);
  }

  public static create(
    props: Omit<AuthConfigProps, "id" | "status" | "createdAt" | "updatedAt">
  ): AuthConfigEntity {
    if (!props.environmentId) throw new BadRequestError("Environment ID is required", "MISSING_ENV_ID");
    if (!props.userIdClaim) throw new BadRequestError("User ID claim is required for token parsing", "MISSING_USER_CLAIM");
    if (props.strategy === "jwks" && !props.jwksUri) throw new BadRequestError("JWKS URI required for jwks strategy", "MISSING_JWKS_URI");
    if (props.strategy === "jwt" && !props.signingSecret) throw new BadRequestError("Signing secret required for jwt strategy", "MISSING_SECRET");

    return new AuthConfigEntity({
      ...props,
      id: crypto.randomUUID(),
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public update(props: Partial<Omit<AuthConfigProps, "id" | "environmentId" | "createdAt" | "updatedAt">>): void {
    if (props.provider) this.props.provider = props.provider;
    if (props.strategy) this.props.strategy = props.strategy;
    if (props.jwksUri !== undefined) this.props.jwksUri = props.jwksUri;
    if (props.signingSecret !== undefined) this.props.signingSecret = props.signingSecret;
    if (props.issuer !== undefined) this.props.issuer = props.issuer;
    if (props.audience !== undefined) this.props.audience = props.audience;
    if (props.userIdClaim) this.props.userIdClaim = props.userIdClaim;
    if (props.status) this.props.status = props.status;

    this.props.updatedAt = new Date();
  }

  public toPrimitives(): AuthConfigProps {
    return { ...this.props };
  }
}
