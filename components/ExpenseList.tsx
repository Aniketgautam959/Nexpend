'use client';

import { useMemo, useState } from 'react';
import { Record } from '@/types/Record';
import RecordItem from './RecordItem';
import { EXPENSE_CATEGORIES } from '@/lib/expenseMeta';

export default function ExpenseList({ records }: { records: Record[] }) {
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [monthFilter, setMonthFilter] = useState('all');

  const monthOptions = useMemo(() => {
    const map = new Map<string, string>();
    for (const r of records) {
      const d = new Date(r.date);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (!map.has(key)) {
        map.set(
          key,
          d.toLocaleString('en-IN', { month: 'short', year: 'numeric' })
        );
      }
    }
    return Array.from(map.entries()).map(([value, label]) => ({ value, label }));
  }, [records]);

  const filtered = useMemo(() => {
    return records.filter((r) => {
      if (category !== 'all' && r.category !== category) return false;
      if (monthFilter !== 'all') {
        const d = new Date(r.date);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        if (key !== monthFilter) return false;
      }
      if (query.trim()) {
        const q = query.toLowerCase();
        const hay = `${r.text} ${r.merchant || ''} ${r.note || ''} ${r.paymentMethod || ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [records, category, monthFilter, query]);

  return (
    <section className='panel p-5 sm:p-6'>
      <div className='flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4'>
        <div>
          <h2 className='panel-title'>All expenses</h2>
          <p className='panel-sub mt-0.5'>Filter by month, category, or search</p>
        </div>
        <span className='pill-badge !normal-case tracking-normal self-start'>
          {filtered.length} shown
        </span>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-5'>
        <input
          type='search'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Search Netflix, Amazon…'
          className='input-field'
        />
        <select
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
          className='input-field cursor-pointer'
        >
          <option value='all'>All months</option>
          {monthOptions.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className='input-field cursor-pointer'
        >
          <option value='all'>All categories</option>
          {EXPENSE_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {records.length === 0 ? (
        <div className='rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 py-12 text-center'>
          <p className='font-semibold text-zinc-900 dark:text-white mb-1'>
            No expenses yet
          </p>
          <p className='text-sm text-zinc-500'>
            Add subscriptions, shopping, and bills — they’ll show up here.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className='rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 py-10 text-center'>
          <p className='text-sm text-zinc-500'>No matches for this filter</p>
        </div>
      ) : (
        <ul className='divide-y divide-zinc-200 dark:divide-zinc-800 list-none p-0 m-0'>
          {filtered.map((record) => (
            <RecordItem key={record.id} record={record} />
          ))}
        </ul>
      )}
    </section>
  );
}
