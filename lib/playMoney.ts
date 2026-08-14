/** India-local calendar. Expense dates are stored as UTC noon on the picked day. */

const IST = 'Asia/Kolkata';

const WEEKDAY_MON_1: Record<string, number> = {
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
  Sun: 7,
};

const COMMITTED_CATEGORIES = new Set(['Bills']);

const COMMITTED_HINT =
  /\b(rent|emi|sip|loan|insurance|recharge|electricity|wifi|broadband|maintenance|society|hostel|lic|nps|ppf|\brd\b|\bfd\b)\b/i;

export type Ymd = { y: number; m: number; d: number };

export type PlayMoneySnapshot = {
  monthlyIncome: number;
  savingsGoal: number;
  lockedMonthly: number;
  playBudget: number;
  playSpentMonth: number;
  playSpentWeek: number;
  playLeftMonth: number;
  lockedSpentMonth: number;
  weekSpendable: number;
  dailyPace: number;
  daysLeftInMonth: number;
  daysLeftInWeek: number;
  daysInMonth: number;
  overPlay: boolean;
};

export type PlayRecord = {
  amount: number;
  category: string;
  text: string;
  date: Date;
  isCommitted: boolean;
  recurringExpenseId?: string | null;
};

export type PlayRecurring = {
  id: string;
  amount: number;
  isActive: boolean;
  isCommitted: boolean;
};

export function defaultIsCommitted(
  category: string,
  text = '',
  merchant = ''
): boolean {
  if (COMMITTED_CATEGORIES.has(category)) return true;
  return COMMITTED_HINT.test(`${text} ${merchant}`);
}

export function istToday(now = new Date()): Ymd & { weekdayMon1: number } {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: IST,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  }).formatToParts(now);

  const get = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? '';

  const weekday = get('weekday');
  return {
    y: Number(get('year')),
    m: Number(get('month')),
    d: Number(get('day')),
    weekdayMon1: WEEKDAY_MON_1[weekday] ?? 1,
  };
}

export function recordYmd(date: Date): Ymd {
  return {
    y: date.getUTCFullYear(),
    m: date.getUTCMonth() + 1,
    d: date.getUTCDate(),
  };
}

export function daysInMonth(y: number, m: number) {
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
}

export function addDays(ymd: Ymd, delta: number): Ymd {
  const next = new Date(Date.UTC(ymd.y, ymd.m - 1, ymd.d + delta, 12, 0, 0));
  return recordYmd(next);
}

export function ymdToUtcStart(ymd: Ymd) {
  return new Date(Date.UTC(ymd.y, ymd.m - 1, ymd.d, 0, 0, 0));
}

export function compareYmd(a: Ymd, b: Ymd) {
  if (a.y !== b.y) return a.y - b.y;
  if (a.m !== b.m) return a.m - b.m;
  return a.d - b.d;
}

export function inYmdRange(date: Ymd, start: Ymd, endExclusive: Ymd) {
  return compareYmd(date, start) >= 0 && compareYmd(date, endExclusive) < 0;
}

export function istMonthBounds(now = new Date()) {
  const today = istToday(now);
  const start = { y: today.y, m: today.m, d: 1 };
  const next =
    today.m === 12
      ? { y: today.y + 1, m: 1, d: 1 }
      : { y: today.y, m: today.m + 1, d: 1 };
  return {
    today,
    start,
    end: next,
    startDate: new Date(Date.UTC(start.y, start.m - 1, 1, 0, 0, 0)),
    endDate: new Date(Date.UTC(next.y, next.m - 1, 1, 0, 0, 0)),
  };
}

export function istWeekStart(today: Ymd & { weekdayMon1: number }): Ymd {
  return addDays(today, 1 - today.weekdayMon1);
}

export function isCommittedExpense(
  record: PlayRecord,
  committedRecurringIds: Set<string>
): boolean {
  if (record.isCommitted) return true;
  if (
    record.recurringExpenseId &&
    committedRecurringIds.has(record.recurringExpenseId)
  ) {
    return true;
  }
  return false;
}

export function computePlayMoney(input: {
  monthlyIncome: number;
  savingsGoal: number;
  recurring: PlayRecurring[];
  records: PlayRecord[];
  now?: Date;
}): PlayMoneySnapshot {
  const now = input.now ?? new Date();
  const { today, start: monthStart, end: monthEnd } = istMonthBounds(now);
  const weekStart = istWeekStart(today);
  const weekEnd = addDays(weekStart, 7);

  const lockedMonthly = input.recurring
    .filter((item) => item.isActive && item.isCommitted)
    .reduce((sum, item) => sum + item.amount, 0);

  const committedRecurringIds = new Set(
    input.recurring.filter((item) => item.isCommitted).map((item) => item.id)
  );

  const savingsGoal = Math.max(0, input.savingsGoal || 0);
  const monthlyIncome = Math.max(0, input.monthlyIncome || 0);
  const playBudget = Math.max(0, monthlyIncome - lockedMonthly - savingsGoal);

  let playSpentMonth = 0;
  let playSpentWeek = 0;
  let lockedSpentMonth = 0;

  for (const record of input.records) {
    const ymd = recordYmd(record.date);
    const locked = isCommittedExpense(record, committedRecurringIds);
    const inMonth = inYmdRange(ymd, monthStart, monthEnd);
    const inWeek = inYmdRange(ymd, weekStart, weekEnd);

    if (inMonth && locked) lockedSpentMonth += record.amount;
    if (inMonth && !locked) playSpentMonth += record.amount;
    if (inWeek && !locked) playSpentWeek += record.amount;
  }

  const playLeftMonth = playBudget - playSpentMonth;
  const daysInMonthCount = daysInMonth(today.y, today.m);
  const daysLeftInMonth = Math.max(1, daysInMonthCount - today.d + 1);
  const daysLeftInWeek = Math.max(1, 8 - today.weekdayMon1);
  const overPlay = playLeftMonth < 0;

  const weekSpendable = overPlay
    ? playLeftMonth
    : playLeftMonth * (daysLeftInWeek / daysLeftInMonth);

  const dailyPace = playLeftMonth / daysLeftInMonth;

  return {
    monthlyIncome,
    savingsGoal,
    lockedMonthly,
    playBudget,
    playSpentMonth,
    playSpentWeek,
    playLeftMonth,
    lockedSpentMonth,
    weekSpendable,
    dailyPace,
    daysLeftInMonth,
    daysLeftInWeek,
    daysInMonth: daysInMonthCount,
    overPlay,
  };
}
