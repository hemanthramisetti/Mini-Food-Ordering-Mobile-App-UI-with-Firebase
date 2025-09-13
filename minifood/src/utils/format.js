// Currency and helpers
export const currency = (value, locale = 'en-US', currency = 'USD') => {
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(Number(value || 0));
  } catch (e) {
    // Fallback if Intl not available
    const n = Number(value || 0).toFixed(2);
    return `$${n}`;
  }
};