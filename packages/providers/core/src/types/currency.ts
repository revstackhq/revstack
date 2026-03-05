/**
 * ISO 4217 currency codes supported by payment providers.
 * Using a union type for compile-time validation and autocomplete.
 */
export type CurrencyCode =
  // --- Major ---
  | "USD"
  | "EUR"
  | "GBP"
  | "JPY"
  | "CAD"
  | "AUD"
  | "CHF"
  | "CNY"
  | "HKD"
  | "SGD"
  | "NZD"
  // --- Latin America ---
  | "BRL"
  | "MXN"
  | "ARS"
  | "CLP"
  | "COP"
  | "PEN"
  | "UYU"
  // --- Europe ---
  | "SEK"
  | "NOK"
  | "DKK"
  | "PLN"
  | "CZK"
  | "HUF"
  | "RON"
  | "BGN"
  | "TRY"
  // --- Asia & Middle East ---
  | "INR"
  | "KRW"
  | "THB"
  | "MYR"
  | "IDR"
  | "PHP"
  | "TWD"
  | "AED"
  | "SAR"
  | "ILS"
  // --- Africa ---
  | "ZAR"
  | "NGN"
  | "KES"
  | "EGP";
