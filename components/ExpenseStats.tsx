import { formatMoney } from '@/lib/expenseMeta';

type ExpenseStatsProps = {
  totalSpent: number;
  daysWithRecords: number;
  bestExpense?: number;
  worstExpense?: number;
};

const ExpenseStats = ({
  totalSpent,
  daysWithRecords,
  bestExpense,
  worstExpense,
}: ExpenseStatsProps) => {
  const validDays = daysWithRecords > 0 ? daysWithRecords : 1;
  const averageExpense = totalSpent / validDays;

  return (
    <section className='panel p-4 sm:p-5'>
      <div className='grid grid-cols-3 gap-3 sm:gap-6 divide-x divide-zinc-200 dark:divide-zinc-800'>
        <div className='min-w-0 pr-0'>
          <p className='text-xs text-zinc-500 mb-1'>Average / day</p>
          <p className='text-lg sm:text-xl font-semibold tracking-tight text-zinc-900 dark:text-white tabular-nums truncate'>
            {formatMoney(averageExpense)}
          </p>
          <p className='text-[11px] text-zinc-500 mt-0.5'>
            {validDays} day{validDays === 1 ? '' : 's'} logged
          </p>
        </div>
        <div className='min-w-0 pl-3 sm:pl-6'>
          <p className='text-xs text-zinc-500 mb-1'>Highest</p>
          <p className='text-lg sm:text-xl font-semibold tracking-tight text-zinc-900 dark:text-white tabular-nums truncate'>
            {bestExpense !== undefined ? formatMoney(bestExpense) : '—'}
          </p>
        </div>
        <div className='min-w-0 pl-3 sm:pl-6'>
          <p className='text-xs text-zinc-500 mb-1'>Lowest</p>
          <p className='text-lg sm:text-xl font-semibold tracking-tight text-zinc-900 dark:text-white tabular-nums truncate'>
            {worstExpense !== undefined ? formatMoney(worstExpense) : '—'}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ExpenseStats;
