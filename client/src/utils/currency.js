// ─── Currency Formatter ───────────────────────────────────────────────────────
// Change CURRENCY_SYMBOL here to update across the whole site

export const CURRENCY_SYMBOL = "KSh";

/**
 * Format a number as Kenya Shillings
 * e.g. formatPrice(1500) → "KSh 1,500"
 */
export function formatPrice(amount) {
  return `${CURRENCY_SYMBOL} ${Number(amount).toLocaleString("en-KE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}
