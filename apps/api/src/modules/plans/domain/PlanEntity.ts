import { Entity } from "@/common/domain/Entity";

export interface PlanProps {
  id?: string;
  name: string;
  isArchived: boolean;
  isHidden: boolean;
  description?: string;
  currency?: string;
}

export class PlanEntity extends Entity<PlanProps> {
  private constructor(props: PlanProps) {
    super(props);
  }

  public static restore(props: PlanProps): PlanEntity {
    return new PlanEntity(props);
  }

  public static create(
    name: string,
    description?: string,
    currency?: string,
  ): PlanEntity {
    return new PlanEntity({
      name,
      isArchived: false,
      isHidden: false,
      description,
      currency,
    });
  }

  public archive(): void {
    if (this.props.isArchived) {
      throw new Error("PlanAlreadyArchived");
    }
    this.props.isArchived = true;
  }

  public hide(): void {
    if (this.props.isHidden) {
      throw new Error("PlanAlreadyHidden");
    }
    this.props.isHidden = true;
  }
}
