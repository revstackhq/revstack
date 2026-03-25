import { BadRequestError, DomainError } from "@/common/errors/DomainError";

export interface CustomerProps {
  id: string;
  environmentId: string;
  userId: string;
  providerId: string;
  externalId: string;
  email: string;
  name: string;
  phone?: string | null;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export class CustomerEntity {
  private constructor(private readonly props: CustomerProps) {}

  get id() {
    return this.props.id;
  }
  get email() {
    return this.props.email;
  }
  get environmentId() {
    return this.props.environmentId;
  }
  get userId() {
    return this.props.userId;
  }
  get providerId() {
    return this.props.providerId;
  }
  get externalId() {
    return this.props.externalId;
  }
  get name() {
    return this.props.name;
  }
  get phone() {
    return this.props.phone;
  }
  get metadata() {
    return this.props.metadata ?? {};
  }
  get createdAt() {
    return this.props.createdAt;
  }

  public static restore(props: CustomerProps): CustomerEntity {
    return new CustomerEntity(props);
  }

  public static create(
    props: Omit<CustomerProps, "id" | "createdAt">,
  ): CustomerEntity {
    if (!props.email.includes("@")) {
      throw new BadRequestError(
        "The provided email is invalid",
        "INVALID_EMAIL",
      );
    }

    if (!props.externalId) {
      throw new BadRequestError(
        "External ID is mandatory for customer identification",
        "MISSING_EXTERNAL_ID",
      );
    }

    return new CustomerEntity({
      ...props,
      id: crypto.randomUUID(),
      metadata: props.metadata || {},
      createdAt: new Date(),
    });
  }

  public updateName(newName: string) {
    this.props.name = newName;
  }

  public toPrimitives(): CustomerProps {
    return { ...this.props };
  }
}
