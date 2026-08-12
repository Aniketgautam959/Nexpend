'use client';

import { useEffect, useState, useTransition } from 'react';
import {
  getMonthlyOverview,
  MonthlyOverviewData,
} from '@/app/actions/getMonthlyOverview';
import {
  categoryInitial,
  categoryTone,
  formatMoney,
} from '@/lib/expenseMeta';

export default function MonthlyOverview({
  initialData,
}: {
  initialData?: MonthlyOverviewData | null;
}) {
  const [year, setYear] = useState(
    () => initialData?.year ?? new Date().getFullYear()
  );
  const [month, setMonth] = useState(
    () => initialData?.month ?? new Date().getMonth()
  );
  const [data, setData] = useState<MonthlyOverviewData | null>(
    () => initialData ?? null
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    // Use server-provided data for the current month — no extra round trip
    if (
      initialData &&
      year === initialData.year &&
      month === initialData.month
    ) {
      setData(initialData);
      setError(null);
      return;
    }

    startTransition(async () => {
      const result = await getMonthlyOverview(year, month);
      if (result.error) {
        setError(result.error);
        setData(null);
      } else {
        setError(null);
        setData(result.data || null);
      }
    });
  }, [year, month, initialData]);

  const shiftMonth = (delta: number) => {
    const d = new Date(year, month + delta, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
  };

  const maxCategory = data?.byCategory[0]?.amount || 1;

  return (
    <section className='panel p-5 sm:p-6'>
      <div className='flex items-start justify-between gap-3 mb-5'>
        <div>
          <h2 className='panel-title'>This month</h2>
          <p className='panel-sub mt-0.5'>OTT, shopping, bills — category view</p>
        </div>
        <div className='flex items-center gap-1'>
          <button
            type='button'
            onClick={() => shiftMonth(-1)}
            className='h-8 w-8 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            aria-label='Previous month'
          >
            ‹
          </button>
          <span className='text-xs font-medium text-zinc-700 dark:text-zinc-300 min-w-[7.5rem] text-center'>
            {data?.monthLabel || '…'}
          </span>
          <button
            type='button'
            onClick={() => shiftMonth(1)}
            className='h-8 w-8 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            aria-label='Next month'
          >
            ›
          </button>
        </div>
      </div>

      {error && <p className='text-sm text-red-500'>{error}</p>}

      {!error && (
        <>
          <div className='mb-5'>
            <p className='text-xs text-zinc-500 mb-1'>Total spent</p>
            <p className='text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white tabular-nums'>
              {pending && !data ? '…' : formatMoney(data?.total || 0)}
            </p>
            <p className='text-xs text-zinc-500 mt-1.5'>
              {data?.count || 0} expense{(data?.count || 0) === 1 ? '' : 's'}
            </p>
          </div>

          {data && data.byCategory.length > 0 ? (
            <div className='space-y-3'>
              {data.byCategory.map((row) => {
                const pct = Math.max(4, (row.amount / maxCategory) * 100);
                return (
                  <div key={row.category}>
                    <div className='flex items-center justify-between gap-2 mb-1.5'>
                      <div className='flex items-center gap-2 min-w-0'>
                        <span
                          className={`h-7 w-7 rounded-lg flex items-center justify-center text-xs font-semibold shrink-0 ${categoryTone(row.category)}`}
                        >
                          {categoryInitial(row.category)}
                        </span>
                        <span className='text-sm text-zinc-800 dark:text-zinc-200 truncate'>
                          {row.category}
                        </span>
                        <span className='text-[11px] text-zinc-500'>
                          {row.count}×
                        </span>
                      </div>
                      <span className='text-sm font-semibold tabular-nums text-zinc-900 dark:text-white shrink-0'>
                        {formatMoney(row.amount)}
                      </span>
                    </div>
                    <div className='h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden'>
                      <div
                        className='h-full rounded-full bg-accent/80'
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className='rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 py-8 text-center'>
              <p className='text-sm text-zinc-500'>No expenses this month yet</p>
            </div>
          )}

          {data && data.topMerchants.length > 0 && (
            <div className='mt-6 pt-5 border-t border-zinc-200 dark:border-zinc-800'>
              <p className='text-xs font-medium text-zinc-500 mb-3'>Top places</p>
              <ul className='space-y-2'>
                {data.topMerchants.map((m) => (
                  <li
                    key={m.merchant}
                    className='flex items-center justify-between gap-3 text-sm'
                  >
                    <span className='text-zinc-700 dark:text-zinc-300 truncate'>
                      {m.merchant}
                    </span>
                    <span className='font-medium tabular-nums text-zinc-900 dark:text-white shrink-0'>
                      {formatMoney(m.amount)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </section>
  );
}
