export const CURRENCIES = {
  INR: { symbol: "₹", rate: 1, label: "Indian Rupee" },
  USD: { symbol: "$", rate: 0.012, label: "US Dollar" },
  EUR: { symbol: "€", rate: 0.011, label: "Euro" },
  GBP: { symbol: "£", rate: 0.009, label: "British Pound" },
  AUD: { symbol: "A$", rate: 0.018, label: "Australian Dollar" },
} as const;

export type CurrencyCode = keyof typeof CURRENCIES;

export function formatCurrency(amountInINR: number, code: string = "INR") {
  const c = CURRENCIES[code as CurrencyCode] || CURRENCIES.INR;
  const converted = amountInINR * c.rate;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: code,
    maximumFractionDigits: 0,
  }).format(Math.round(converted));
}
