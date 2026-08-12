import { redirect } from 'next/navigation';
import AddNewRecord from '@/components/AddNewRecord';
import AIInsights from '@/components/AIInsights';
import BudgetStrip from '@/components/BudgetStrip';
import ExpenseList from '@/components/ExpenseList';
import ExpenseStats from '@/components/ExpenseStats';
import Guest from '@/components/Guest';
import MonthlyOverview from '@/components/MonthlyOverview';
import RecordChart from '@/components/RecordChart';
import getUserRecord from '@/app/actions/getUserRecord';
import getRecord from '@/app/actions/getRecord';
import getBestWorstExpense from '@/app/actions/getBestWorstExpense';
import { getMonthlyOverview } from '@/app/actions/getMonthlyOverview';
import { getCurrentUser } from '@/lib/auth';
import { formatMoney } from '@/lib/expenseMeta';

export default async function HomePage() {
  const user = await getCurrentUser();
  if (!user) {
    return <Guest />;
  }

  if (!user.onboardingComplete) {
    redirect('/onboarding');
  }

  const [userRecordResult, recordsResult, rangeResult, monthlyResult] =
    await Promise.all([
      getUserRecord(),
      getRecord(),
      getBestWorstExpense(),
      getMonthlyOverview(),
    ]);

  const totalSpent = userRecordResult.record ?? 0;
  const entryCount = recordsResult.records?.length ?? 0;
  const avgDaily =
    (userRecordResult.daysWithRecords ?? 0) > 0
      ? totalSpent / (userRecordResult.daysWithRecords as number)
      : 0;
  const topSpend = rangeResult.bestExpense;
  const displayName = user.name || user.email.split('@')[0];
  const records = recordsResult.records ?? [];
  const spentThisMonth = monthlyResult.data?.total ?? 0;
  const monthlyIncome = user.monthlyIncome ?? 0;

  return (
    <main className='dash-bg min-h-screen text-foreground'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6'>
        <header className='flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 pb-2 border-b border-zinc-200 dark:border-zinc-800'>
          <div className='flex items-center gap-3.5'>
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
            <div>
              <h1 className='text-xl sm:text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white'>
                {displayName}
              </h1>
              <p className='text-sm text-zinc-500'>Monthly expense dashboard</p>
            </div>
          </div>

          <div className='flex flex-wrap gap-x-6 gap-y-2 text-sm'>
            <div>
              <span className='text-zinc-500'>This month </span>
              <span className='font-semibold text-zinc-900 dark:text-white tabular-nums'>
                {formatMoney(spentThisMonth)}
              </span>
            </div>
            <div>
              <span className='text-zinc-500'>Left </span>
              <span className='font-semibold text-zinc-900 dark:text-white tabular-nums'>
                {formatMoney(monthlyIncome - spentThisMonth)}
              </span>
            </div>
            <div>
              <span className='text-zinc-500'>Avg/day </span>
              <span className='font-semibold text-zinc-900 dark:text-white tabular-nums'>
                {formatMoney(avgDaily)}
              </span>
            </div>
            <div>
              <span className='text-zinc-500'>High </span>
              <span className='font-semibold text-zinc-900 dark:text-white tabular-nums'>
                {topSpend !== undefined ? formatMoney(topSpend) : '—'}
              </span>
            </div>
          </div>
        </header>

        {monthlyIncome > 0 && (
          <BudgetStrip
            monthlyIncome={monthlyIncome}
            savingsGoal={user.savingsGoal}
            spentThisMonth={spentThisMonth}
          />
        )}

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 items-start'>
          <div className='space-y-6 lg:sticky lg:top-20 lg:self-start'>
            <AddNewRecord />
            <ExpenseStats />
          </div>
          <div className='space-y-6'>
            <MonthlyOverview key={entryCount} />
            <RecordChart />
          </div>
        </div>

        <AIInsights />
        <ExpenseList records={records} />
      </div>
    </main>
  );
}
