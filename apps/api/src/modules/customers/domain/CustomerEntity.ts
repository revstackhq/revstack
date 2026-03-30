import { Entity } from "@/common/domain/Entity";
import { BadRequestError } from "@/common/errors/DomainError";

export interface CustomerProps {
  id?: string;
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

export class CustomerEntity extends Entity<CustomerProps> {
  private constructor(props: CustomerProps) {
    super(props);
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
      metadata: props.metadata || {},
      createdAt: new Date(),
    });
  }

  public updateName(newName: string) {
    this.props.name = newName;
  }
}
