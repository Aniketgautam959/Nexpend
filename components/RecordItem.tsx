'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Record } from '@/types/Record';
import deleteRecord from '@/app/actions/deleteRecord';
import {
  categoryInitial,
  categoryTone,
  formatMoney,
} from '@/lib/expenseMeta';

const RecordItem = ({ record }: { record: Record }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleDeleteRecord = async (recordId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await deleteRecord(recordId);
      if (result.error) {
        setError(result.error);
        setTimeout(() => setError(null), 5000);
      } else {
        router.refresh();
      }
    } catch {
      setError('Delete failed. Try again.');
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const metaBits = [
    record.merchant,
    record.paymentMethod,
    record.category,
  ].filter(Boolean);

  return (
    <li className='group flex items-center gap-3 sm:gap-4 py-3.5 first:pt-0 last:pb-0 list-none'>
      <div
        className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center text-sm font-semibold ${categoryTone(record?.category)}`}
      >
        {categoryInitial(record?.category)}
      </div>

      <div className='flex-1 min-w-0'>
        <p className='text-sm font-medium text-zinc-900 dark:text-white truncate'>
          {record?.text}
        </p>
        <p className='text-xs text-zinc-500 mt-0.5 truncate'>
          {new Date(record?.date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
          {metaBits.length > 0 ? ` · ${metaBits.join(' · ')}` : ''}
          {record.note ? ` · ${record.note}` : ''}
        </p>
        {error && <p className='text-xs text-red-500 mt-1'>{error}</p>}
      </div>

      <div className='flex items-center gap-2 shrink-0'>
        <span className='text-sm sm:text-base font-semibold tracking-tight text-zinc-900 dark:text-white tabular-nums'>
          {formatMoney(record?.amount || 0)}
        </span>
        <button
          onClick={() => handleDeleteRecord(record.id)}
          className='h-8 w-8 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-500/10 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all flex items-center justify-center'
          aria-label='Delete record'
          disabled={isLoading}
          title='Delete'
        >
          {isLoading ? (
            <span className='h-3.5 w-3.5 border-2 border-zinc-400/30 border-t-zinc-400 rounded-full animate-spin' />
          ) : (
            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          )}
        </button>
      </div>
    </li>
  );
};

export default RecordItem;
