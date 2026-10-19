/** Formats amount in Indian Rupee format (e.g. ₹12,50,000) */
export function formatINR(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '₹0'
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDateSafe(isoDate?: string): string {
  if (!isoDate) return '—'
  try {
    const d = new Date(isoDate)
    return isNaN(d.getTime()) ? '—' : d.toLocaleDateString()
  } catch {
    return '—'
  }
}
