// --- Wallet Events ---

export class WalletCreditedEvent {
  constructor(
    public readonly walletId: string,
    public readonly customerId: string,
    public readonly amount: number,
    public readonly occurredAt: Date = new Date()
  ) {}
}

export class WalletDebitedEvent {
  constructor(
    public readonly walletId: string,
    public readonly customerId: string,
    public readonly amount: number,
    public readonly occurredAt: Date = new Date()
  ) {}
}
