export type DedupeInput = {
  amount: number;
  merchant?: string | null;
  text?: string | null;
  date: Date | string;
  upiRef?: string | null;
  fingerprint?: string | null;
};

function calendarDay(date: Date | string) {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
}

export function normalizeMerchant(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(
      /\b(pvt|ltd|limited|private|india|online|payments?|payment|upi|pvtltd|llp|inc|com)\b/g,
      ' '
    )
    .replace(/\s+/g, ' ')
    .trim();
}

export function normalizeUpiRef(raw: string) {
  const cleaned = raw.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  if (cleaned.length < 8 || cleaned.length > 40) return '';
  // Ignore generic words the model might copy
  if (/^(UPI|UTR|TRANSACTION|SUCCESS|PAID)$/.test(cleaned)) return '';
  return cleaned;
}

export function merchantsMatch(a?: string | null, b?: string | null) {
  const na = normalizeMerchant(a || '');
  const nb = normalizeMerchant(b || '');
  if (!na || !nb) return false;
  if (na === nb) return true;
  if (na.length < 4 || nb.length < 4) return false;
  return na.includes(nb) || nb.includes(na);
}

export function expenseFingerprint(input: DedupeInput) {
  const ref = input.upiRef ? normalizeUpiRef(input.upiRef) : '';
  if (ref) return `ref:${ref}`;

  const amount = Number.isFinite(input.amount)
    ? input.amount.toFixed(2)
    : '0.00';
  const merchant =
    normalizeMerchant(input.merchant || input.text || '') || 'unknown';
  const day = calendarDay(input.date);
  return `a:${amount}|m:${merchant}|d:${day}`;
}

export function isSameUpiPayment(a: DedupeInput, b: DedupeInput) {
  const refA = a.upiRef ? normalizeUpiRef(a.upiRef) : '';
  const refB = b.upiRef ? normalizeUpiRef(b.upiRef) : '';
  if (refA && refB && refA === refB) return true;

  if (a.fingerprint && b.fingerprint && a.fingerprint === b.fingerprint) {
    return true;
  }

  if (Math.abs((a.amount || 0) - (b.amount || 0)) > 0.009) return false;
  if (calendarDay(a.date) !== calendarDay(b.date)) return false;

  const merchantA = a.merchant || a.text || '';
  const merchantB = b.merchant || b.text || '';
  return merchantsMatch(merchantA, merchantB);
}
