import { formatMoney } from '@/lib/expenseMeta';
import Link from 'next/link';

type Props = {
  monthlyIncome: number;
  savingsGoal: number | null;
  spentThisMonth: number;
};

export default function BudgetStrip({
  monthlyIncome,
  savingsGoal,
  spentThisMonth,
}: Props) {
  const remaining = monthlyIncome - spentThisMonth;
  const savedSoFar = Math.max(0, remaining);
  const goal = savingsGoal && savingsGoal > 0 ? savingsGoal : null;
  const goalProgress = goal
    ? Math.min(100, Math.round((savedSoFar / goal) * 100))
    : null;
  const spendPct = Math.min(
    100,
    Math.round((spentThisMonth / monthlyIncome) * 100)
  );

  return (
    <section className='panel overflow-hidden p-0'>
      {/* Wallet header */}
      <div className='bg-gradient-to-br from-zinc-900 to-zinc-800 dark:from-zinc-900 dark:to-black border-b border-zinc-700/40 px-5 sm:px-6 py-5'>
        <div className='flex items-start justify-between gap-3 mb-4'>
          <div className='flex items-center gap-3'>
            <div className='h-10 w-10 rounded-xl bg-accent flex items-center justify-center shrink-0'>
              <span className='text-accent-foreground text-lg font-bold'>₹</span>
            </div>
            <div>
              <p className='text-[11px] text-zinc-400'>This month left</p>
              <p
                className={`text-2xl font-semibold tabular-nums tracking-tight ${
                  remaining < 0 ? 'text-red-400' : 'text-white'
                }`}
              >
                {formatMoney(remaining)}
              </p>
            </div>
          </div>
          <Link
            href='/profile'
            className='text-xs text-zinc-400 hover:text-white underline-offset-2 hover:underline shrink-0'
          >
            Edit plan
          </Link>
        </div>

        <div className='h-1.5 rounded-full bg-zinc-700 overflow-hidden mb-2'>
          <div
            className={`h-full rounded-full ${
              spendPct >= 90 ? 'bg-red-500' : 'bg-accent'
            }`}
            style={{ width: `${spendPct}%` }}
          />
        </div>
        <div className='flex justify-between text-[11px] text-zinc-500'>
          <span>Spent {formatMoney(spentThisMonth)}</span>
          <span>Budget {formatMoney(monthlyIncome)}</span>
        </div>
      </div>

      <div className='p-5 sm:p-6'>
        <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
          <div>
            <p className='text-xs text-zinc-500 mb-1'>Income</p>
            <p className='text-lg font-semibold tabular-nums text-zinc-900 dark:text-white'>
              {formatMoney(monthlyIncome)}
            </p>
          </div>
          <div>
            <p className='text-xs text-zinc-500 mb-1'>Spent</p>
            <p className='text-lg font-semibold tabular-nums text-zinc-900 dark:text-white'>
              {formatMoney(spentThisMonth)}
            </p>
          </div>
          <div>
            <p className='text-xs text-zinc-500 mb-1'>Left</p>
            <p
              className={`text-lg font-semibold tabular-nums ${
                remaining < 0
                  ? 'text-red-500'
                  : 'text-zinc-900 dark:text-white'
              }`}
            >
              {formatMoney(remaining)}
            </p>
          </div>
          <div>
            <p className='text-xs text-zinc-500 mb-1'>
              {goal ? 'Toward goal' : 'Unspent'}
            </p>
            <p className='text-lg font-semibold tabular-nums text-accent'>
              {formatMoney(savedSoFar)}
              {goalProgress !== null ? (
                <span className='text-xs font-medium text-zinc-500 ml-1.5'>
                  {goalProgress}%
                </span>
              ) : null}
            </p>
          </div>
        </div>

        {goal && (
          <p className='text-[11px] text-zinc-500 pt-4'>
            Savings goal: {formatMoney(goal)} / month
            {savedSoFar >= goal
              ? ' — goal met so far this month'
              : ` — ${formatMoney(Math.max(0, goal - savedSoFar))} more to hit goal`}
          </p>
        )}
        {remaining < 0 && (
          <p className='text-[11px] text-red-500 pt-2'>
            You’re over income by {formatMoney(Math.abs(remaining))} this month
          </p>
        )}
      </div>
    </section>
  );
}
