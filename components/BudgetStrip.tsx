import { formatMoney } from '@/lib/expenseMeta';
import type { PlayMoneySnapshot } from '@/lib/playMoney';
import Link from 'next/link';

type Props = {
  play: PlayMoneySnapshot;
};

function clampPct(n: number) {
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.min(100, Math.round(n));
}

export default function BudgetStrip({ play }: Props) {
  const {
    monthlyIncome,
    savingsGoal,
    lockedMonthly,
    playBudget,
    playSpentMonth,
    playSpentWeek,
    playLeftMonth,
    weekSpendable,
    dailyPace,
    daysLeftInWeek,
    overPlay,
  } = play;

  const playPct = playBudget > 0 ? clampPct((playSpentMonth / playBudget) * 100) : 0;
  const lockedPct =
    monthlyIncome > 0
      ? clampPct(((lockedMonthly + savingsGoal) / monthlyIncome) * 100)
      : 0;
  const goal = savingsGoal > 0 ? savingsGoal : null;
  const weekLabel =
    daysLeftInWeek === 1 ? 'today' : `the next ${daysLeftInWeek} days`;

  return (
    <section className='panel overflow-hidden p-0'>
      <div className='bg-gradient-to-br from-zinc-900 to-zinc-800 dark:from-zinc-900 dark:to-black border-b border-zinc-700/40 px-5 sm:px-6 py-5'>
        <div className='flex items-start justify-between gap-3 mb-1'>
          <div className='flex items-center gap-3 min-w-0'>
            <div className='h-10 w-10 rounded-xl bg-accent flex items-center justify-center shrink-0'>
              <span className='text-accent-foreground text-lg font-bold'>₹</span>
            </div>
            <div className='min-w-0'>
              <p className='text-[11px] text-zinc-400'>
                {overPlay
                  ? 'Over play money this month'
                  : `You can actually spend ${weekLabel}`}
              </p>
              <p
                className={`text-2xl sm:text-3xl font-semibold tabular-nums tracking-tight ${
                  overPlay || weekSpendable < 0 ? 'text-red-400' : 'text-white'
                }`}
              >
                {formatMoney(Math.round(weekSpendable))}
              </p>
            </div>
          </div>
          <Link
            href='/profile'
            className='text-xs text-zinc-400 hover:text-white underline-offset-2 hover:underline shrink-0'
          >
            Edit plan
          </Link>
        </div>

        <p className='text-[11px] text-zinc-500 mb-4 pl-[3.25rem]'>
          {overPlay
            ? `Play budget blown by ${formatMoney(Math.abs(playLeftMonth))} — Swiggy/OTT is eating next week’s money`
            : `${formatMoney(Math.round(Math.max(0, dailyPace)))} / day pace · ${formatMoney(Math.max(0, playLeftMonth))} play left this month`}
        </p>

        <div className='h-1.5 rounded-full bg-zinc-700 overflow-hidden mb-2'>
          <div
            className={`h-full rounded-full ${
              playPct >= 90 || overPlay ? 'bg-red-500' : 'bg-accent'
            }`}
            style={{ width: `${overPlay ? 100 : playPct}%` }}
          />
        </div>
        <div className='flex justify-between text-[11px] text-zinc-500'>
          <span>
            Play spent {formatMoney(playSpentMonth)}
            {playSpentWeek > 0 ? ` · ${formatMoney(playSpentWeek)} this week` : ''}
          </span>
          <span>Play budget {formatMoney(playBudget)}</span>
        </div>
      </div>

      <div className='p-5 sm:p-6'>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5'>
          <div className='rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/40 px-4 py-3.5'>
            <p className='text-[11px] font-medium uppercase tracking-wide text-zinc-500 mb-1'>
              Locked
            </p>
            <p className='text-lg font-semibold tabular-nums text-zinc-900 dark:text-white'>
              {formatMoney(lockedMonthly)}
            </p>
            <p className='text-[11px] text-zinc-500 mt-1'>
              Rent, SIPs, EMIs, recharge
              {goal ? ` · ${formatMoney(goal)} savings parked` : ''}
            </p>
            <div className='h-1 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden mt-3'>
              <div
                className='h-full rounded-full bg-zinc-400 dark:bg-zinc-500'
                style={{ width: `${lockedPct}%` }}
              />
            </div>
          </div>

          <div className='rounded-2xl border border-accent/25 bg-accent/10 px-4 py-3.5'>
            <p className='text-[11px] font-medium uppercase tracking-wide text-accent mb-1'>
              Play money
            </p>
            <p
              className={`text-lg font-semibold tabular-nums ${
                playLeftMonth < 0 ? 'text-red-500' : 'text-accent'
              }`}
            >
              {formatMoney(Math.max(0, playLeftMonth))}
            </p>
            <p className='text-[11px] text-zinc-500 dark:text-zinc-400 mt-1'>
              Swiggy, OTT, shopping — {formatMoney(playBudget)} this month
            </p>
            <div className='h-1 rounded-full bg-accent/20 overflow-hidden mt-3'>
              <div
                className={`h-full rounded-full ${
                  overPlay ? 'bg-red-500' : 'bg-accent'
                }`}
                style={{ width: `${overPlay ? 100 : playPct}%` }}
              />
            </div>
          </div>
        </div>

        <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
          <div>
            <p className='text-xs text-zinc-500 mb-1'>Income</p>
            <p className='text-lg font-semibold tabular-nums text-zinc-900 dark:text-white'>
              {formatMoney(monthlyIncome)}
            </p>
          </div>
          <div>
            <p className='text-xs text-zinc-500 mb-1'>Locked + save</p>
            <p className='text-lg font-semibold tabular-nums text-zinc-900 dark:text-white'>
              {formatMoney(lockedMonthly + savingsGoal)}
            </p>
          </div>
          <div>
            <p className='text-xs text-zinc-500 mb-1'>Play left</p>
            <p
              className={`text-lg font-semibold tabular-nums ${
                playLeftMonth < 0
                  ? 'text-red-500'
                  : 'text-zinc-900 dark:text-white'
              }`}
            >
              {formatMoney(playLeftMonth)}
            </p>
          </div>
          <div>
            <p className='text-xs text-zinc-500 mb-1'>This week</p>
            <p
              className={`text-lg font-semibold tabular-nums ${
                weekSpendable < 0 ? 'text-red-500' : 'text-accent'
              }`}
            >
              {formatMoney(Math.round(weekSpendable))}
            </p>
          </div>
        </div>

        {lockedMonthly === 0 && (
          <p className='text-[11px] text-zinc-500 pt-4'>
            Mark rent / SIP / EMI as <span className='font-medium'>Locked</span> in
            Recurring — then this week’s number is what’s actually spendable.
          </p>
        )}
        {overPlay && (
          <p className='text-[11px] text-red-500 pt-2'>
            You’re over play money by {formatMoney(Math.abs(playLeftMonth))} this
            month
          </p>
        )}
      </div>
    </section>
  );
}
