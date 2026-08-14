'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { completeOnboardingAction } from '@/app/actions/onboarding';
import { formatMoney } from '@/lib/expenseMeta';

export default function OnboardingForm({ name }: { name: string }) {
  const router = useRouter();
  const [income, setIncome] = useState<number | ''>('');
  const [goal, setGoal] = useState<number | ''>('');
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const incomeNum = typeof income === 'number' ? income : 0;
  const suggestedGoal = incomeNum > 0 ? Math.round(incomeNum * 0.2) : 0;

  return (
    <main className='dash-bg min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12'>
      <div className='w-full max-w-md panel p-6 sm:p-8'>
        <p className='text-xs font-medium text-zinc-500 mb-2'>Step 1 of 1</p>
        <h1 className='text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white mb-2'>
          Hi {name}, set your monthly plan
        </h1>
        <p className='text-sm text-zinc-500 mb-6 leading-relaxed'>
          Tell us your monthly income so we can lock rent/SIPs, park savings,
          and show what you can actually spend this week.
        </p>

        <form
          action={(fd) => {
            setError(null);
            startTransition(async () => {
              const res = await completeOnboardingAction(fd);
              if (res?.error) {
                setError(res.error);
                return;
              }
              router.push('/');
              router.refresh();
            });
          }}
          className='space-y-4'
        >
          <div className='space-y-1.5'>
            <label
              htmlFor='monthlyIncome'
              className='text-xs font-medium text-zinc-500'
            >
              Monthly income / salary
            </label>
            <div className='relative'>
              <span className='absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 text-sm'>
                ₹
              </span>
              <input
                id='monthlyIncome'
                name='monthlyIncome'
                type='number'
                min='1'
                step='1'
                required
                value={income}
                onChange={(e) =>
                  setIncome(e.target.value ? parseFloat(e.target.value) : '')
                }
                className='input-field pl-7'
                placeholder='50000'
              />
            </div>
          </div>

          <div className='space-y-1.5'>
            <label
              htmlFor='savingsGoal'
              className='text-xs font-medium text-zinc-500'
            >
              Monthly savings goal (optional)
            </label>
            <div className='relative'>
              <span className='absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 text-sm'>
                ₹
              </span>
              <input
                id='savingsGoal'
                name='savingsGoal'
                type='number'
                min='0'
                step='1'
                value={goal}
                onChange={(e) =>
                  setGoal(e.target.value ? parseFloat(e.target.value) : '')
                }
                className='input-field pl-7'
                placeholder={
                  suggestedGoal > 0
                    ? `Suggested ${suggestedGoal}`
                    : 'e.g. 10000'
                }
              />
            </div>
            {suggestedGoal > 0 && (
              <p className='text-[11px] text-zinc-500'>
                Tip: ~20% of income is {formatMoney(suggestedGoal)}. Leave this
                blank to use that suggestion.
              </p>
            )}
          </div>

          {error && <p className='text-xs text-red-500'>{error}</p>}

          <button
            type='submit'
            className='w-full btn-primary py-2.5'
            disabled={pending}
          >
            {pending ? 'Saving…' : 'Continue to dashboard'}
          </button>
        </form>
      </div>
    </main>
  );
}
