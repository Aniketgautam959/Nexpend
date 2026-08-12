'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { demoLoginAction, loginAction } from '@/lib/auth-actions';
import { DEMO_EMAIL, DEMO_PASSWORD } from '@/lib/demoAccount';

export default function SignInPage() {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <main className='dash-bg min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12'>
      <div className='w-full max-w-sm panel p-6 sm:p-7'>
        <h1 className='text-xl font-semibold tracking-tight text-zinc-900 dark:text-white mb-1'>
          Sign in
        </h1>
        <p className='text-sm text-zinc-500 mb-6'>
          Use your email and password
        </p>

        <form
          action={(fd) => {
            setError(null);
            startTransition(async () => {
              const res = await loginAction(fd);
              if (res?.error) setError(res.error);
            });
          }}
          className='space-y-3.5'
        >
          <div className='space-y-1.5'>
            <label htmlFor='email' className='text-xs font-medium text-zinc-500'>
              Email
            </label>
            <input
              id='email'
              name='email'
              type='email'
              required
              className='input-field'
              placeholder='you@email.com'
              autoComplete='email'
            />
          </div>
          <div className='space-y-1.5'>
            <label htmlFor='password' className='text-xs font-medium text-zinc-500'>
              Password
            </label>
            <input
              id='password'
              name='password'
              type='password'
              required
              className='input-field'
              placeholder='••••••••'
              autoComplete='current-password'
            />
          </div>

          {error && <p className='text-xs text-red-500'>{error}</p>}

          <button type='submit' className='w-full btn-primary py-2.5' disabled={pending}>
            {pending ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <button
          type='button'
          disabled={pending}
          onClick={() => {
            setError(null);
            startTransition(async () => {
              await demoLoginAction();
            });
          }}
          className='w-full mt-3 btn-ghost py-2.5 text-sm'
        >
          {pending ? 'Opening demo…' : 'Try demo account'}
        </button>

        <p className='mt-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/40 px-3.5 py-2.5 text-center text-xs text-zinc-500'>
          Demo login:{' '}
          <span className='text-zinc-700 dark:text-zinc-300'>{DEMO_EMAIL}</span>
          {' / '}
          <span className='text-zinc-700 dark:text-zinc-300'>{DEMO_PASSWORD}</span>
        </p>

        <p className='text-sm text-zinc-500 mt-5 text-center'>
          No account?{' '}
          <Link href='/sign-up' className='text-zinc-900 dark:text-white underline underline-offset-2'>
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
