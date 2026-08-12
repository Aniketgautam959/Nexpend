import React from 'react';
import getUserRecord from '@/app/actions/getUserRecord';
import getBestWorstExpense from '@/app/actions/getBestWorstExpense';
import { formatMoney } from '@/lib/expenseMeta';

const ExpenseStats = async () => {
  try {
    const [userRecordResult, rangeResult] = await Promise.all([
      getUserRecord(),
      getBestWorstExpense(),
    ]);

    const { record, daysWithRecords, error: userError } = userRecordResult;
    const { bestExpense, worstExpense, error: rangeError } = rangeResult;

    if (userError) console.error('ExpenseStats - User record error:', userError);
    if (rangeError) console.error('ExpenseStats - Range error:', rangeError);

    const validRecord = record || 0;
    const validDays =
      daysWithRecords && daysWithRecords > 0 ? daysWithRecords : 1;
    const averageExpense = validRecord / validDays;

    return (
      <section className='panel p-5 sm:p-6'>
        <h2 className='panel-title mb-5'>Stats</h2>

        <div className='mb-5'>
          <p className='text-xs text-zinc-500 mb-1'>Average per day</p>
          <p className='text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white tabular-nums'>
            {formatMoney(averageExpense)}
          </p>
          <p className='text-xs text-zinc-500 mt-1.5'>
            {validDays} day{validDays === 1 ? '' : 's'} with expenses
          </p>
        </div>

        <div className='grid grid-cols-2 gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800'>
          <div>
            <p className='text-xs text-zinc-500 mb-1'>Highest</p>
            <p className='text-lg font-semibold tracking-tight text-zinc-900 dark:text-white tabular-nums'>
              {bestExpense !== undefined ? formatMoney(bestExpense) : '—'}
            </p>
          </div>
          <div>
            <p className='text-xs text-zinc-500 mb-1'>Lowest</p>
            <p className='text-lg font-semibold tracking-tight text-zinc-900 dark:text-white tabular-nums'>
              {worstExpense !== undefined ? formatMoney(worstExpense) : '—'}
            </p>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('Error fetching expense statistics:', error);
    return (
      <section className='panel p-5 sm:p-6'>
        <h2 className='panel-title mb-2'>Stats</h2>
        <p className='text-sm text-zinc-500'>Couldn’t load stats.</p>
      </section>
    );
  }
};

export default ExpenseStats;
