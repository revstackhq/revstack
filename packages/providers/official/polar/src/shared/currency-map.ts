export const currencyMap = {
  aud: "AUD",
  brl: "BRL",
  cad: "CAD",
  chf: "CHF",
  eur: "EUR",
  inr: "INR",
  gbp: "GBP",
  jpy: "JPY",
  sek: "SEK",
  usd: "USD",
} as const;

export type Currency = (typeof currencyMap)[keyof typeof currencyMap];
