import { InvalidTrialDateError } from "./SubscriptionErrors";

export interface SubscriptionPeriodProps {
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  trialStart?: Date;
  trialEnd?: Date;
}

export class SubscriptionPeriod {
  private constructor(
    private readonly props: Readonly<SubscriptionPeriodProps>,
  ) {}

  public static create(props: SubscriptionPeriodProps): SubscriptionPeriod {
    if (props.trialEnd && props.trialEnd <= new Date()) {
      throw new InvalidTrialDateError();
    }
    return new SubscriptionPeriod(props);
  }

  public static restore(props: SubscriptionPeriodProps): SubscriptionPeriod {
    return new SubscriptionPeriod(props);
  }

  get currentPeriodStart(): Date {
    return new Date(this.props.currentPeriodStart);
  }
  get currentPeriodEnd(): Date {
    return new Date(this.props.currentPeriodEnd);
  }
  get trialStart(): Date | undefined {
    return this.props.trialStart ? new Date(this.props.trialStart) : undefined;
  }
  get trialEnd(): Date | undefined {
    return this.props.trialEnd ? new Date(this.props.trialEnd) : undefined;
  }

  get isExpired(): boolean {
    return this.props.currentPeriodEnd < new Date();
  }

  get isTrialValid(): boolean {
    if (!this.props.trialEnd) return false;
    return this.props.trialEnd > new Date();
  }

  get isWithinTrial(): boolean {
    return this.isTrialValid;
  }

  public toJSON(): SubscriptionPeriodProps {
    return {
      currentPeriodStart: this.currentPeriodStart,
      currentPeriodEnd: this.currentPeriodEnd,
      trialStart: this.trialStart,
      trialEnd: this.trialEnd,
    };
  }
}
