export class WalletNotFoundError extends Error {
  constructor(customerId: string) {
    super(`Wallet for customer ${customerId} not found.`);
    this.name = "WalletNotFoundError";
  }
}

export class InsufficientFundsError extends Error {
  constructor(customerId: string) {
    super(`Insufficient funds in wallet for customer ${customerId}.`);
    this.name = "InsufficientFundsError";
  }
}
