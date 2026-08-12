'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { registerAction } from '@/lib/auth-actions';

export default function SignUpPage() {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <main className='dash-bg min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12'>
      <div className='w-full max-w-sm panel p-6 sm:p-7'>
        <h1 className='text-xl font-semibold tracking-tight text-zinc-900 dark:text-white mb-1'>
          Create account
        </h1>
        <p className='text-sm text-zinc-500 mb-6'>
          Fast signup — no third-party wait
        </p>

        <form
          action={(fd) => {
            setError(null);
            startTransition(async () => {
              const res = await registerAction(fd);
              if (res?.error) setError(res.error);
            });
          }}
          className='space-y-3.5'
        >
          <div className='space-y-1.5'>
            <label htmlFor='name' className='text-xs font-medium text-zinc-500'>
              Name
            </label>
            <input
              id='name'
              name='name'
              type='text'
              className='input-field'
              placeholder='Your name'
              autoComplete='name'
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
              minLength={6}
              className='input-field'
              placeholder='Min 6 characters'
              autoComplete='new-password'
            />
          </div>

          {error && <p className='text-xs text-red-500'>{error}</p>}

          <button type='submit' className='w-full btn-primary py-2.5' disabled={pending}>
            {pending ? 'Creating…' : 'Sign up'}
          </button>
        </form>

        <p className='text-sm text-zinc-500 mt-5 text-center'>
          Already have an account?{' '}
          <Link href='/sign-in' className='text-zinc-900 dark:text-white underline underline-offset-2'>
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
