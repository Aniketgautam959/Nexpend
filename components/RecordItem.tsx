'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Record } from '@/types/Record';
import deleteRecord from '@/app/actions/deleteRecord';
import { updateExpenseRecord } from '@/app/actions/updateExpenseRecord';
import {
  EXPENSE_CATEGORIES,
  PAYMENT_METHODS,
  categoryInitial,
  categoryTone,
  formatMoney,
} from '@/lib/expenseMeta';

function toDateInput(value: string | number | Date) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
}

const RecordItem = ({ record }: { record: Record }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [text, setText] = useState(record.text);
  const [amount, setAmount] = useState(record.amount);
  const [category, setCategory] = useState(record.category || '');
  const [merchant, setMerchant] = useState(record.merchant || '');
  const [paymentMethod, setPaymentMethod] = useState(
    record.paymentMethod || ''
  );
  const [note, setNote] = useState(record.note || '');
  const [date, setDate] = useState(toDateInput(record.date));
  const [isCommitted, setIsCommitted] = useState(Boolean(record.isCommitted));

  const openEdit = () => {
    setText(record.text);
    setAmount(record.amount);
    setCategory(record.category || '');
    setMerchant(record.merchant || '');
    setPaymentMethod(record.paymentMethod || '');
    setNote(record.note || '');
    setDate(toDateInput(record.date));
    setIsCommitted(Boolean(record.isCommitted));
    setError(null);
    setEditing(true);
  };

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const result = await updateExpenseRecord(record.id, {
        text,
        amount,
        category,
        merchant: merchant || undefined,
        paymentMethod: paymentMethod || undefined,
        note: note || undefined,
        date,
        isCommitted,
      });
      if (result.error) {
        setError(result.error);
      } else {
        setEditing(false);
        router.refresh();
      }
    } catch {
      setError('Update failed. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const metaBits = [
    record.merchant,
    record.paymentMethod,
    record.category,
  ].filter(Boolean);

  return (
    <li className='group list-none py-3.5 first:pt-0 last:pb-0'>
      <div className='flex items-center gap-3 sm:gap-4'>
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
            {record.isCommitted ? ' · Locked' : ''}
            {record.note ? ` · ${record.note}` : ''}
          </p>
          {error && !editing && (
            <p className='text-xs text-red-500 mt-1'>{error}</p>
          )}
        </div>

        <div className='flex items-center gap-1.5 shrink-0'>
          <span className='text-sm sm:text-base font-semibold tracking-tight text-zinc-900 dark:text-white tabular-nums mr-1'>
            {formatMoney(record?.amount || 0)}
          </span>
          <button
            type='button'
            onClick={openEdit}
            className='h-8 w-8 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all flex items-center justify-center'
            aria-label='Edit expense'
            title='Edit'
          >
            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
              />
            </svg>
          </button>
          <button
            type='button'
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
      </div>

      {editing && (
        <form
          onSubmit={handleSave}
          className='mt-3 ml-0 sm:ml-[3.25rem] rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 p-4 space-y-3'
        >
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
            <div className='space-y-1.5 sm:col-span-2'>
              <label className='text-xs font-medium text-zinc-500'>
                What did you spend on?
              </label>
              <input
                className='input-field'
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
              />
            </div>
            <div className='space-y-1.5'>
              <label className='text-xs font-medium text-zinc-500'>Amount</label>
              <div className='relative'>
                <span className='absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 text-sm'>
                  ₹
                </span>
                <input
                  type='number'
                  min='0'
                  step='0.01'
                  className='input-field pl-7'
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  required
                />
              </div>
            </div>
            <div className='space-y-1.5'>
              <label className='text-xs font-medium text-zinc-500'>Date</label>
              <input
                type='date'
                className='input-field'
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className='space-y-1.5'>
              <label className='text-xs font-medium text-zinc-500'>Category</label>
              <select
                className='input-field cursor-pointer'
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                {EXPENSE_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div className='space-y-1.5'>
              <label className='text-xs font-medium text-zinc-500'>Paid via</label>
              <select
                className='input-field cursor-pointer'
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value=''>Optional…</option>
                {PAYMENT_METHODS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
            <div className='space-y-1.5'>
              <label className='text-xs font-medium text-zinc-500'>
                Merchant
              </label>
              <input
                className='input-field'
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                placeholder='Optional'
              />
            </div>
            <div className='space-y-1.5'>
              <label className='text-xs font-medium text-zinc-500'>Note</label>
              <input
                className='input-field'
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder='Optional'
              />
            </div>
          </div>
          <label className='flex items-start gap-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3.5 py-3 cursor-pointer'>
            <input
              type='checkbox'
              className='mt-0.5 accent-emerald-600'
              checked={isCommitted}
              onChange={(e) => setIsCommitted(e.target.checked)}
            />
            <span>
              <span className='text-sm font-medium text-zinc-900 dark:text-white'>
                Locked bill
              </span>
              <span className='block text-[11px] text-zinc-500 mt-0.5'>
                Keep this out of play money
              </span>
            </span>
          </label>
          {error && <p className='text-xs text-red-500'>{error}</p>}
          <div className='flex items-center gap-2'>
            <button
              type='submit'
              className='btn-primary px-4 py-2 text-sm'
              disabled={saving}
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
            <button
              type='button'
              onClick={() => setEditing(false)}
              className='btn-ghost px-4 py-2 text-sm'
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </li>
  );
};

export default RecordItem;
