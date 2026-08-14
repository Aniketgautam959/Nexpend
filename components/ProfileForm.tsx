'use client';

import { useState, useTransition } from 'react';
import { updateProfileAction, logoutAction } from '@/lib/auth-actions';

type ProfileUser = {
  id: string;
  email: string;
  name: string | null;
  monthlyIncome?: number | null;
  savingsGoal?: number | null;
};

export default function ProfileForm({ user }: { user: ProfileUser }) {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const save = (fd: FormData) => {
    setMessage(null);
    setError(null);
    startTransition(async () => {
      const res = await updateProfileAction(fd);
      if (res?.error) setError(res.error);
      else setMessage('Settings saved');
    });
  };

  return (
    <div className='space-y-6'>
      <form action={save} className='space-y-6'>
        <section className='panel p-5 sm:p-6'>
          <div className='mb-5'>
            <h2 className='panel-title'>Account</h2>
            <p className='panel-sub mt-0.5'>Your basic profile details</p>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div className='space-y-1.5'>
              <label htmlFor='name' className='text-xs font-medium text-zinc-500'>
                Full name
              </label>
              <input
                id='name'
                name='name'
                type='text'
                required
                defaultValue={user.name || ''}
                className='input-field'
              />
            </div>
            <div className='space-y-1.5'>
              <label htmlFor='email' className='text-xs font-medium text-zinc-500'>
                Email
              </label>
              <input
                id='email'
                name='email'
                type='email'
                required
                defaultValue={user.email}
                className='input-field'
              />
            </div>
          </div>
        </section>

        <section className='panel p-5 sm:p-6'>
          <div className='mb-5'>
            <h2 className='panel-title'>Monthly plan</h2>
            <p className='panel-sub mt-0.5'>
            Used for locked bills vs play money this week
            </p>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div className='space-y-1.5'>
              <label
                htmlFor='monthlyIncome'
                className='text-xs font-medium text-zinc-500'
              >
                Monthly income
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
                  defaultValue={user.monthlyIncome ?? ''}
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
                Savings goal
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
                  defaultValue={user.savingsGoal ?? ''}
                  className='input-field pl-7'
                  placeholder='10000'
                />
              </div>
            </div>
          </div>
        </section>

        <section className='panel p-5 sm:p-6'>
          <div className='mb-5'>
            <h2 className='panel-title'>Security</h2>
            <p className='panel-sub mt-0.5'>
              Leave blank if you don’t want to change your password
            </p>
          </div>
          <div className='max-w-md space-y-1.5'>
            <label
              htmlFor='password'
              className='text-xs font-medium text-zinc-500'
            >
              New password
            </label>
            <input
              id='password'
              name='password'
              type='password'
              minLength={6}
              autoComplete='new-password'
              className='input-field'
              placeholder='Min 6 characters'
            />
          </div>
        </section>

        <div className='flex flex-col sm:flex-row sm:items-center gap-3'>
          <button
            type='submit'
            className='btn-primary px-6 py-2.5'
            disabled={pending}
          >
            {pending ? 'Saving…' : 'Save settings'}
          </button>
          {error && <p className='text-sm text-red-500'>{error}</p>}
          {message && !error && (
            <p className='text-sm text-zinc-500'>{message}</p>
          )}
        </div>
      </form>

      <section className='panel p-5 sm:p-6 border-red-500/20'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          <div>
            <h2 className='text-sm font-semibold text-zinc-900 dark:text-white'>
              Sign out
            </h2>
            <p className='text-xs text-zinc-500 mt-0.5'>
              End your session on this device
            </p>
          </div>
          <form action={logoutAction}>
            <button
              type='submit'
              className='text-sm font-medium text-red-500 hover:text-red-400 px-4 py-2 rounded-xl border border-red-500/30 hover:bg-red-500/10 transition-colors'
            >
              Sign out
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
