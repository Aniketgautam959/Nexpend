import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import AddNewRecord from '@/components/AddNewRecord';
import AIInsights from '@/components/AIInsights';
import BudgetStrip from '@/components/BudgetStrip';
import ExpenseList from '@/components/ExpenseList';
import ExpenseStats from '@/components/ExpenseStats';
import Guest from '@/components/Guest';
import MonthlyOverview from '@/components/MonthlyOverview';
import RecordChart from '@/components/RecordChart';
import RecurringExpenses from '@/components/RecurringExpenses';
import CategoryBudgets from '@/components/CategoryBudgets';
import { getDashboardData } from '@/lib/dashboard';
import { getCurrentUser } from '@/lib/auth';
import { formatMoney } from '@/lib/expenseMeta';
import { processDueRecurringExpenses } from '@/app/actions/recurringExpenses';

export default async function HomePage() {
  const user = await getCurrentUser();
  if (!user) {
    return <Guest />;
  }

  if (!user.onboardingComplete) {
    redirect('/onboarding');
  }

  // Auto-log Netflix / rent / SIPs that are due
  await processDueRecurringExpenses();

  const monthlyIncome = user.monthlyIncome ?? 0;
  const {
    records,
    totalSpent,
    daysWithRecords,
    bestExpense,
    worstExpense,
    monthly,
    play,
  } = await getDashboardData(user.id, {
    monthlyIncome,
    savingsGoal: user.savingsGoal,
  });

  const displayName = user.name || user.email.split('@')[0];
  const spentThisMonth = monthly.total;

  return (
    <main className='dash-bg min-h-screen text-foreground'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6'>
        <header className='flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 pb-2 border-b border-zinc-200 dark:border-zinc-800'>
          <div className='flex items-center gap-3.5'>
            <div className='relative'>
              <div className='h-11 w-11 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-sm font-semibold text-zinc-700 dark:text-zinc-200 overflow-hidden'>
                {user.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.imageUrl}
                    alt=''
                    className='h-full w-full object-cover'
                  />
                ) : (
                  displayName.charAt(0).toUpperCase()
                )}
              </div>
              <span className='absolute -bottom-0.5 -right-0.5 h-5 w-5 rounded-md bg-accent text-accent-foreground text-[10px] font-bold flex items-center justify-center border-2 border-[var(--background)]'>
                ₹
              </span>
            </div>
            <div>
              <h1 className='text-xl sm:text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white'>
                {displayName}
              </h1>
              <p className='text-sm text-zinc-500'>Play money this week</p>
            </div>
          </div>

          <div className='flex flex-wrap gap-x-5 gap-y-2 text-sm'>
            <div className='rounded-xl border border-accent/25 bg-accent/10 px-3.5 py-2'>
              <p className='text-[10px] text-accent mb-0.5'>This week</p>
              <p className='font-semibold text-accent tabular-nums'>
                {formatMoney(Math.round(play.weekSpendable))}
              </p>
            </div>
            <div className='rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/40 px-3.5 py-2'>
              <p className='text-[10px] text-zinc-500 mb-0.5'>Play left</p>
              <p className='font-semibold text-zinc-900 dark:text-white tabular-nums'>
                {formatMoney(play.playLeftMonth)}
              </p>
            </div>
            <div className='rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/40 px-3.5 py-2'>
              <p className='text-[10px] text-zinc-500 mb-0.5'>Locked</p>
              <p className='font-semibold text-zinc-900 dark:text-white tabular-nums'>
                {formatMoney(play.lockedMonthly)}
              </p>
            </div>
            <div className='rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/40 px-3.5 py-2'>
              <p className='text-[10px] text-zinc-500 mb-0.5'>Spent</p>
              <p className='font-semibold text-zinc-900 dark:text-white tabular-nums'>
                {formatMoney(spentThisMonth)}
              </p>
            </div>
          </div>
        </header>

        {monthlyIncome > 0 && <BudgetStrip play={play} />}

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-5 items-start'>
          <AddNewRecord />
          <MonthlyOverview key={records.length} initialData={monthly} />
        </div>

        <RecordChart records={records} />

        <ExpenseStats
          totalSpent={totalSpent}
          daysWithRecords={daysWithRecords}
          bestExpense={bestExpense}
          worstExpense={worstExpense}
        />

        <RecurringExpenses />

        <CategoryBudgets />

        <Suspense
          fallback={
            <section className='panel p-5 sm:p-6'>
              <h2 className='panel-title mb-2'>AI insights</h2>
              <p className='text-sm text-zinc-500'>Loading insights…</p>
            </section>
          }
        >
          <AIInsights />
        </Suspense>
        <ExpenseList records={records} />
      </div>
    </main>
  );
}
