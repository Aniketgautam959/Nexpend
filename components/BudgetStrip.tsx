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
    <section className='panel p-5 sm:p-6'>
      <div className='flex items-start justify-between gap-3 mb-5'>
        <div>
          <h2 className='panel-title'>This month’s money</h2>
          <p className='panel-sub mt-0.5'>
            Income vs spend — based on your onboarding
          </p>
        </div>
        <Link
          href='/profile'
          className='text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white underline-offset-2 hover:underline shrink-0'
        >
          Edit plan
        </Link>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5'>
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

      <div className='space-y-2'>
        <div className='flex justify-between text-[11px] text-zinc-500'>
          <span>Spent of income</span>
          <span>{spendPct}%</span>
        </div>
        <div className='h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden'>
          <div
            className={`h-full rounded-full ${
              spendPct >= 90 ? 'bg-red-500' : 'bg-accent'
            }`}
            style={{ width: `${spendPct}%` }}
          />
        </div>
        {goal && (
          <p className='text-[11px] text-zinc-500 pt-1'>
            Savings goal: {formatMoney(goal)} / month
            {savedSoFar >= goal
              ? ' — goal met so far this month'
              : ` — ${formatMoney(Math.max(0, goal - savedSoFar))} more to hit goal`}
          </p>
        )}
        {remaining < 0 && (
          <p className='text-[11px] text-red-500'>
            You’re over income by {formatMoney(Math.abs(remaining))} this month
          </p>
        )}
      </div>
    </section>
  );
}
