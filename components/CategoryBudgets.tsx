'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  deleteCategoryBudget,
  getCategoryBudgets,
  upsertCategoryBudget,
  type CategoryBudgetRow,
} from '@/app/actions/categoryBudgets';
import {
  EXPENSE_CATEGORIES,
  categoryInitial,
  categoryTone,
  formatMoney,
} from '@/lib/expenseMeta';

export default function CategoryBudgets() {
  const router = useRouter();
  const [items, setItems] = useState<CategoryBudgetRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState('Food');
  const [amount, setAmount] = useState(5000);

  const load = async () => {
    const result = await getCategoryBudgets();
    if (result.items) setItems(result.items);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const refresh = () => {
    startTransition(() => router.refresh());
    void load();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const result = await upsertCategoryBudget({ category, amount });
    if (result.error) {
      setError(result.error);
      return;
    }
    setOpen(false);
    setAmount(5000);
    refresh();
  };

  const handleDelete = async (id: string) => {
    await deleteCategoryBudget(id);
    refresh();
  };

  return (
    <section className='panel p-5 sm:p-6'>
      <div className='flex items-start justify-between gap-3 mb-4'>
        <div>
          <h2 className='panel-title'>Category budgets</h2>
          <p className='panel-sub mt-0.5'>
            Cap Food, Shopping, Bills — alert when you near the limit
          </p>
        </div>
        <button
          type='button'
          onClick={() => setOpen((v) => !v)}
          className='btn-ghost !px-3 !py-1.5 text-xs'
        >
          {open ? 'Close' : '+ Set'}
        </button>
      </div>

      {open && (
        <form
          onSubmit={handleSave}
          className='mb-5 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 space-y-3'
        >
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
            <div className='space-y-1.5'>
              <label className='text-xs font-medium text-zinc-500'>Category</label>
              <select
                className='input-field cursor-pointer'
                value={category}
                onChange={(e) => setCategory(e.target.value)}
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
                Monthly limit
              </label>
              <div className='relative'>
                <span className='absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 text-sm'>
                  ₹
                </span>
                <input
                  type='number'
                  min='1'
                  step='1'
                  className='input-field pl-7'
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  required
                />
              </div>
            </div>
          </div>
          {error && <p className='text-xs text-red-500'>{error}</p>}
          <button
            type='submit'
            className='btn-primary w-full sm:w-auto px-5 py-2'
            disabled={pending}
          >
            Save budget
          </button>
        </form>
      )}

      {loading ? (
        <p className='text-sm text-zinc-500'>Loading…</p>
      ) : items.length === 0 ? (
        <div className='rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 py-8 text-center'>
          <p className='text-sm text-zinc-500'>
            No category budgets yet. Set Food ₹5,000 or Shopping ₹3,000.
          </p>
        </div>
      ) : (
        <ul className='space-y-4'>
          {items.map((item) => {
            const over = item.pct >= 100;
            const warn = item.pct >= 80 && !over;
            const barPct = Math.min(100, item.pct);
            return (
              <li key={item.id}>
                <div className='flex items-center justify-between gap-3 mb-1.5'>
                  <div className='flex items-center gap-2 min-w-0'>
                    <span
                      className={`h-7 w-7 rounded-lg flex items-center justify-center text-xs font-semibold shrink-0 ${categoryTone(item.category)}`}
                    >
                      {categoryInitial(item.category)}
                    </span>
                    <div className='min-w-0'>
                      <p className='text-sm font-medium text-zinc-900 dark:text-white truncate'>
                        {item.category}
                      </p>
                      <p className='text-[11px] text-zinc-500'>
                        {formatMoney(item.spent)} of {formatMoney(item.amount)}
                        {over
                          ? ' · over budget'
                          : warn
                            ? ' · nearly full'
                            : ''}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center gap-2 shrink-0'>
                    <span
                      className={`text-xs font-semibold tabular-nums ${
                        over
                          ? 'text-red-500'
                          : warn
                            ? 'text-amber-500'
                            : 'text-zinc-500'
                      }`}
                    >
                      {item.pct}%
                    </span>
                    <button
                      type='button'
                      onClick={() => handleDelete(item.id)}
                      className='text-xs text-red-500/80 hover:text-red-500 underline-offset-2 hover:underline'
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className='h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden'>
                  <div
                    className={`h-full rounded-full ${
                      over
                        ? 'bg-red-500'
                        : warn
                          ? 'bg-amber-500'
                          : 'bg-accent'
                    }`}
                    style={{ width: `${barPct}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
