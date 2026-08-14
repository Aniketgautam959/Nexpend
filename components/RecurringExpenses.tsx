'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  addRecurringExpense,
  deleteRecurringExpense,
  getRecurringExpenses,
  setRecurringCommitted,
  toggleRecurringExpense,
  type RecurringExpenseDTO,
} from '@/app/actions/recurringExpenses';
import { EXPENSE_CATEGORIES, PAYMENT_METHODS, formatMoney } from '@/lib/expenseMeta';
import { defaultIsCommitted } from '@/lib/playMoney';

export default function RecurringExpenses() {
  const router = useRouter();
  const [items, setItems] = useState<RecurringExpenseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [text, setText] = useState('');
  const [amount, setAmount] = useState(199);
  const [category, setCategory] = useState('Subscriptions');
  const [merchant, setMerchant] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [dayOfMonth, setDayOfMonth] = useState(1);
  const [isCommitted, setIsCommitted] = useState(false);
  const [committedTouched, setCommittedTouched] = useState(false);

  const load = async () => {
    const result = await getRecurringExpenses();
    if (result.items) setItems(result.items);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const refreshAll = () => {
    startTransition(() => {
      router.refresh();
    });
    void load();
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const result = await addRecurringExpense({
      text,
      amount,
      category,
      merchant: merchant || undefined,
      paymentMethod: paymentMethod || undefined,
      dayOfMonth,
      isCommitted,
    });
    if (result.error) {
      setError(result.error);
      return;
    }
    setText('');
    setAmount(199);
    setMerchant('');
    setPaymentMethod('');
    setDayOfMonth(1);
    setCategory('Subscriptions');
    setIsCommitted(false);
    setCommittedTouched(false);
    setOpen(false);
    refreshAll();
  };

  const handleToggle = async (id: string) => {
    await toggleRecurringExpense(id);
    refreshAll();
  };

  const handleCommitted = async (id: string, next: boolean) => {
    await setRecurringCommitted(id, next);
    refreshAll();
  };

  const handleDelete = async (id: string) => {
    await deleteRecurringExpense(id);
    refreshAll();
  };

  return (
    <section className='panel p-5 sm:p-6'>
      <div className='flex items-start justify-between gap-3 mb-4'>
        <div>
          <h2 className='panel-title'>Recurring</h2>
          <p className='panel-sub mt-0.5'>
            Locked bills stay out of play money. OTT stays in it.
          </p>
        </div>
        <button
          type='button'
          onClick={() => setOpen((v) => !v)}
          className='btn-ghost !px-3 !py-1.5 text-xs'
        >
          {open ? 'Close' : '+ Add'}
        </button>
      </div>

      {open && (
        <form
          onSubmit={handleAdd}
          className='mb-5 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 space-y-3'
        >
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
            <div className='space-y-1.5'>
              <label className='text-xs font-medium text-zinc-500'>Name</label>
              <input
                className='input-field'
                value={text}
                onChange={(e) => {
                  const next = e.target.value;
                  setText(next);
                  if (!committedTouched) {
                    setIsCommitted(defaultIsCommitted(category, next, merchant));
                  }
                }}
                placeholder='Netflix, Rent, SIP…'
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
                  min='1'
                  step='0.01'
                  className='input-field pl-7'
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  required
                />
              </div>
            </div>
            <div className='space-y-1.5'>
              <label className='text-xs font-medium text-zinc-500'>Category</label>
              <select
                className='input-field cursor-pointer'
                value={category}
                onChange={(e) => {
                  const next = e.target.value;
                  setCategory(next);
                  if (!committedTouched) {
                    setIsCommitted(defaultIsCommitted(next, text, merchant));
                  }
                }}
              >
                {EXPENSE_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div className='space-y-1.5'>
              <label className='text-xs font-medium text-zinc-500'>
                Day of month
              </label>
              <select
                className='input-field cursor-pointer'
                value={dayOfMonth}
                onChange={(e) => setDayOfMonth(parseInt(e.target.value, 10))}
              >
                {Array.from({ length: 28 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>
                    {d}
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
                onChange={(e) => {
                  const next = e.target.value;
                  setMerchant(next);
                  if (!committedTouched) {
                    setIsCommitted(defaultIsCommitted(category, text, next));
                  }
                }}
                placeholder='Optional'
              />
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
          </div>
          <label className='flex items-start gap-3 rounded-xl border border-zinc-200 dark:border-zinc-800 px-3.5 py-3 cursor-pointer'>
            <input
              type='checkbox'
              className='mt-0.5 accent-emerald-600'
              checked={isCommitted}
              onChange={(e) => {
                setCommittedTouched(true);
                setIsCommitted(e.target.checked);
              }}
            />
            <span>
              <span className='text-sm font-medium text-zinc-900 dark:text-white'>
                Locked — rent, SIP, EMI, recharge
              </span>
              <span className='block text-[11px] text-zinc-500 mt-0.5'>
                Comes out of salary before play money. Uncheck for Netflix / OTT.
              </span>
            </span>
          </label>
          {error && <p className='text-xs text-red-500'>{error}</p>}
          <button
            type='submit'
            className='btn-primary w-full sm:w-auto px-5 py-2'
            disabled={pending}
          >
            Save recurring
          </button>
        </form>
      )}

      {loading ? (
        <p className='text-sm text-zinc-500'>Loading…</p>
      ) : items.length === 0 ? (
        <div className='rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 py-8 text-center'>
          <p className='text-sm text-zinc-500'>
            No recurring yet. Add rent or a SIP as locked, Netflix as play.
          </p>
        </div>
      ) : (
        <ul className='divide-y divide-zinc-200 dark:divide-zinc-800'>
          {items.map((item) => (
            <li
              key={item.id}
              className='py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3'
            >
              <div className='min-w-0'>
                <p
                  className={`text-sm font-medium truncate ${
                    item.isActive
                      ? 'text-zinc-900 dark:text-white'
                      : 'text-zinc-400 line-through'
                  }`}
                >
                  {item.text}
                  <span
                    className={`ml-2 text-[10px] font-medium px-1.5 py-0.5 rounded-md ${
                      item.isCommitted
                        ? 'bg-zinc-200/80 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                        : 'bg-accent/15 text-accent'
                    }`}
                  >
                    {item.isCommitted ? 'Locked' : 'Play'}
                  </span>
                </p>
                <p className='text-xs text-zinc-500 mt-0.5'>
                  {formatMoney(item.amount)} · Day {item.dayOfMonth}
                  {item.isActive
                    ? ` · next ${new Date(item.nextRunAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                      })}`
                    : ' · paused'}
                </p>
              </div>
              <div className='flex items-center gap-2 shrink-0'>
                <button
                  type='button'
                  onClick={() => handleCommitted(item.id, !item.isCommitted)}
                  className='text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white underline-offset-2 hover:underline'
                >
                  {item.isCommitted ? 'Make play' : 'Lock'}
                </button>
                <button
                  type='button'
                  onClick={() => handleToggle(item.id)}
                  className='text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white underline-offset-2 hover:underline'
                >
                  {item.isActive ? 'Pause' : 'Resume'}
                </button>
                <button
                  type='button'
                  onClick={() => handleDelete(item.id)}
                  className='text-xs text-red-500/80 hover:text-red-500 underline-offset-2 hover:underline'
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
