export class WalletCreditedEvent {
  constructor(
    public readonly walletId: string,
    public readonly customerId: string,
    public readonly amount: number,
    public readonly occurredAt: Date = new Date()
  ) {}
}
