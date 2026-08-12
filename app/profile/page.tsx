import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import ProfileForm from '@/components/ProfileForm';
import { formatMoney } from '@/lib/expenseMeta';

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/sign-in');
  }

  const displayName = user.name || user.email.split('@')[0];
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <main className='dash-bg min-h-screen text-foreground'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6'>
        <header className='flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-2 border-b border-zinc-200 dark:border-zinc-800'>
          <div>
            <h1 className='text-xl sm:text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white'>
              Settings
            </h1>
            <p className='text-sm text-zinc-500 mt-0.5'>
              Manage your account and monthly budget plan
            </p>
          </div>
          <Link
            href='/'
            className='text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white underline-offset-2 hover:underline'
          >
            ← Back to dashboard
          </Link>
        </header>

        <section className='panel p-5 sm:p-6'>
          <div className='flex flex-col sm:flex-row sm:items-center gap-4'>
            <div className='h-14 w-14 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-lg font-semibold text-zinc-700 dark:text-zinc-200 overflow-hidden shrink-0'>
              {user.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.imageUrl}
                  alt=''
                  className='h-full w-full object-cover'
                />
              ) : (
                initial
              )}
            </div>
            <div className='min-w-0 flex-1'>
              <p className='text-lg font-semibold tracking-tight text-zinc-900 dark:text-white truncate'>
                {displayName}
              </p>
              <p className='text-sm text-zinc-500 truncate'>{user.email}</p>
            </div>
            <div className='flex flex-wrap gap-x-6 gap-y-2 text-sm sm:text-right'>
              <div>
                <p className='text-xs text-zinc-500'>Income</p>
                <p className='font-semibold tabular-nums text-zinc-900 dark:text-white'>
                  {user.monthlyIncome
                    ? formatMoney(user.monthlyIncome)
                    : '—'}
                </p>
              </div>
              <div>
                <p className='text-xs text-zinc-500'>Savings goal</p>
                <p className='font-semibold tabular-nums text-zinc-900 dark:text-white'>
                  {user.savingsGoal ? formatMoney(user.savingsGoal) : '—'}
                </p>
              </div>
            </div>
          </div>
        </section>

        <ProfileForm user={user} />
      </div>
    </main>
  );
}
