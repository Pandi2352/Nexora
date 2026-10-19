/** Lower-cases and trims an email so uniqueness checks are case-insensitive. */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** URL-safe slug: "Acme Inc." → "acme-inc". Used for workspace slugs. */
export function slugify(text: string): string {
  return text
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Escapes user input before building a MongoDB `$regex`, preventing regex injection. */
export function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Makes a value safe for CSV export: neutralises spreadsheet formulas
 * (=, +, -, @, tab, CR) and quotes the cell.
 */
export function toCsvSafe(value: unknown): string {
  const text = value === null || value === undefined ? '' : String(value);
  const neutralised = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
  return `"${neutralised.replace(/"/g, '""')}"`;
}

export const StringUtil = { normalizeEmail, slugify, escapeRegex, toCsvSafe };
