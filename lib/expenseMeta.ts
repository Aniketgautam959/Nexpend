export const EXPENSE_CATEGORIES = [
  { value: 'Food', label: 'Food & Dining' },
  { value: 'Subscriptions', label: 'OTT / Subscriptions' },
  { value: 'Shopping', label: 'Shopping' },
  { value: 'Transportation', label: 'Travel & Transport' },
  { value: 'Bills', label: 'Bills & Recharge' },
  { value: 'Entertainment', label: 'Entertainment' },
  { value: 'Healthcare', label: 'Healthcare' },
  { value: 'Education', label: 'Education' },
  { value: 'Personal', label: 'Personal' },
  { value: 'Other', label: 'Other' },
] as const;

export const PAYMENT_METHODS = [
  { value: 'UPI', label: 'UPI' },
  { value: 'Paytm', label: 'Paytm' },
  { value: 'PhonePe', label: 'PhonePe' },
  { value: 'GPay', label: 'Google Pay' },
  { value: 'Card', label: 'Card' },
  { value: 'Cash', label: 'Cash' },
  { value: 'NetBanking', label: 'Net Banking' },
  { value: 'Other', label: 'Other' },
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number]['value'];

export function formatMoney(amount: number) {
  return `₹${amount.toLocaleString('en-IN', {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

export function categoryInitial(category: string) {
  return (category || 'O').charAt(0).toUpperCase();
}

export function categoryTone(category: string) {
  switch (category) {
    case 'Food':
      return 'bg-orange-500/15 text-orange-600 dark:text-orange-300';
    case 'Subscriptions':
      return 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-300';
    case 'Shopping':
      return 'bg-violet-500/15 text-violet-600 dark:text-violet-300';
    case 'Transportation':
      return 'bg-sky-500/15 text-sky-600 dark:text-sky-300';
    case 'Bills':
      return 'bg-amber-500/15 text-amber-700 dark:text-amber-300';
    case 'Entertainment':
      return 'bg-pink-500/15 text-pink-600 dark:text-pink-300';
    case 'Healthcare':
      return 'bg-rose-500/15 text-rose-600 dark:text-rose-300';
    case 'Education':
      return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300';
    case 'Personal':
      return 'bg-fuchsia-500/15 text-fuchsia-600 dark:text-fuchsia-300';
    default:
      return 'bg-zinc-500/15 text-zinc-600 dark:text-zinc-300';
  }
}
