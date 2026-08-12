import Link from 'next/link';

const AboutPage = () => {
  return (
    <div className='dot-grid min-h-screen text-foreground'>
      {/* Hero */}
      <section className='relative overflow-hidden px-4 sm:px-6 pt-14 sm:pt-20 pb-14 sm:pb-20'>
        <div
          aria-hidden
          className='pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(ellipse_at_top,rgba(34,197,94,0.14),transparent_55%)]'
        />
        <div
          aria-hidden
          className='pointer-events-none absolute left-[-6%] top-28 text-[11rem] sm:text-[14rem] font-semibold leading-none text-accent/[0.06] select-none'
        >
          ₹
        </div>

        <div className='relative z-10 max-w-6xl mx-auto'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center'>
            <div className='text-center lg:text-left'>
              <p className='inline-flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-[0.14em] uppercase text-accent mb-5'>
                <span className='h-7 w-7 rounded-lg bg-accent/15 flex items-center justify-center text-accent text-sm font-bold tracking-normal'>
                  ₹
                </span>
                About Nexpend
              </p>

              <h1 className='font-semibold tracking-tight text-4xl sm:text-5xl md:text-6xl text-zinc-900 dark:text-white leading-[1.05] mb-5'>
                Built for every
                <br />
                rupee you spend.
              </h1>

              <p className='text-base sm:text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-md mx-auto lg:mx-0 mb-8'>
                Nexpend helps you track UPI, cards, and bills in ₹ — with
                screenshot scan, recurring expenses, and AI that speaks money,
                not jargon.
              </p>

              <div className='flex flex-col sm:flex-row gap-3 justify-center lg:justify-start'>
                <Link href='/sign-up' className='btn-primary px-7 py-3'>
                  Start tracking free
                </Link>
                <Link href='/contact' className='btn-ghost px-7 py-3'>
                  Talk to us
                </Link>
              </div>
            </div>

            {/* Wallet visual */}
            <div className='mx-auto w-full max-w-md'>
              <div className='rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 sm:p-6'>
                <div className='rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-800 dark:from-zinc-900 dark:to-black border border-zinc-700/50 p-5 mb-5 text-left'>
                  <div className='flex items-center gap-2.5 mb-4'>
                    <div className='h-9 w-9 rounded-xl bg-accent flex items-center justify-center'>
                      <svg
                        className='w-4 h-4 text-accent-foreground'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'
                        />
                      </svg>
                    </div>
                    <div>
                      <p className='text-[11px] text-zinc-400'>Monthly wallet</p>
                      <p className='text-xl font-semibold text-white tabular-nums tracking-tight'>
                        ₹40,000
                      </p>
                    </div>
                  </div>
                  <div className='grid grid-cols-2 gap-3 text-left'>
                    <div className='rounded-xl bg-white/5 px-3 py-2.5'>
                      <p className='text-[10px] text-zinc-500'>Spent</p>
                      <p className='text-sm font-semibold text-white tabular-nums'>
                        ₹12,480
                      </p>
                    </div>
                    <div className='rounded-xl bg-white/5 px-3 py-2.5'>
                      <p className='text-[10px] text-zinc-500'>Left</p>
                      <p className='text-sm font-semibold text-accent tabular-nums'>
                        ₹27,520
                      </p>
                    </div>
                  </div>
                </div>

                <ul className='space-y-2.5 text-left'>
                  {[
                    { label: 'UPI & card tracking', value: '₹' },
                    { label: 'Receipt screenshot scan', value: '₹' },
                    { label: 'Recurring bills & SIPs', value: '₹' },
                  ].map((row) => (
                    <li
                      key={row.label}
                      className='flex items-center gap-3 rounded-xl border border-zinc-200 dark:border-zinc-800 px-3.5 py-3'
                    >
                      <span className='h-8 w-8 rounded-lg bg-accent/15 text-accent flex items-center justify-center text-sm font-semibold'>
                        {row.value}
                      </span>
                      <span className='text-sm font-medium text-zinc-900 dark:text-white'>
                        {row.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className='px-4 sm:px-6 py-14 sm:py-16 border-t border-zinc-200 dark:border-zinc-800'>
        <div className='max-w-3xl mx-auto text-center'>
          <h2 className='font-semibold tracking-tight text-2xl sm:text-3xl md:text-4xl text-zinc-900 dark:text-white mb-4'>
            Make expense tracking feel simple
          </h2>
          <p className='text-zinc-500 dark:text-zinc-400 leading-relaxed'>
            We use AI so you spend less time logging and more time knowing where
            money goes — budgets in ₹, clear leftover, and tips that actually fit
            how Indians pay (UPI, wallets, cards).
          </p>
        </div>
      </section>

      {/* Why */}
      <section className='px-4 sm:px-6 py-14 sm:py-16 border-t border-zinc-200 dark:border-zinc-800'>
        <div className='max-w-5xl mx-auto'>
          <div className='text-center mb-10'>
            <h2 className='font-semibold tracking-tight text-2xl sm:text-3xl md:text-4xl text-zinc-900 dark:text-white mb-3'>
              Why Nexpend?
            </h2>
            <p className='text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto'>
              A calm wallet for everyday spends — not another cluttered finance app.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10'>
            {[
              {
                title: 'Know what’s left',
                body: 'Income, spent, and remaining — so you always see how much wallet you have this month.',
                icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
              },
              {
                title: 'Scan & auto-fill',
                body: 'Drop a Paytm or GPay screenshot and we fill amount, merchant, and category for you.',
                icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z',
              },
              {
                title: 'Recurring, handled',
                body: 'Netflix, rent, SIPs — set once and Nexpend logs them on the right day every month.',
                icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
              },
            ].map((f) => (
              <div key={f.title} className='text-center md:text-left'>
                <div className='icon-tile mx-auto md:mx-0 mb-4 text-accent border-accent/20 bg-accent/10'>
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={1.75}
                      d={f.icon}
                    />
                  </svg>
                </div>
                <h3 className='font-semibold tracking-tight text-lg text-zinc-900 dark:text-white mb-2'>
                  {f.title}
                </h3>
                <p className='text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed'>
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className='px-4 sm:px-6 py-14 sm:py-16 border-t border-zinc-200 dark:border-zinc-800'>
        <div className='max-w-4xl mx-auto'>
          <div className='text-center mb-10'>
            <h2 className='font-semibold tracking-tight text-2xl sm:text-3xl md:text-4xl text-zinc-900 dark:text-white'>
              Our story
            </h2>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-8 items-start'>
            <div className='space-y-4 text-zinc-500 dark:text-zinc-400 leading-relaxed'>
              <p>
                Nexpend started in 2026 with a simple goal: expense tracking that
                feels like a wallet — clear leftover, Indian payments, zero
                clutter.
              </p>
              <p>
                Every feature — from screenshot scan to recurring bills — is built
                so you spend less time logging and more time staying in control.
              </p>
            </div>

            <div className='rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 space-y-3'>
              {[
                'Founded in 2026',
                'Built for ₹ & UPI',
                'AI that uses rupees',
                'Designed for daily spends',
              ].map((item) => (
                <div key={item} className='flex items-center gap-3'>
                  <span className='h-7 w-7 rounded-lg bg-accent/15 text-accent flex items-center justify-center text-xs font-bold'>
                    ₹
                  </span>
                  <span className='text-sm font-medium text-zinc-900 dark:text-white'>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className='px-4 sm:px-6 py-16 sm:py-20 border-t border-zinc-200 dark:border-zinc-800'>
        <div className='max-w-2xl mx-auto text-center rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/40 px-6 py-12'>
          <div className='mx-auto mb-5 h-12 w-12 rounded-2xl bg-accent/15 text-accent flex items-center justify-center text-xl font-bold'>
            ₹
          </div>
          <h2 className='font-semibold tracking-tight text-2xl sm:text-3xl md:text-4xl text-zinc-900 dark:text-white mb-3'>
            Take control of every rupee
          </h2>
          <p className='text-sm sm:text-base text-zinc-500 dark:text-zinc-400 mb-7'>
            Start tracking expenses with Nexpend — free and built for how you pay.
          </p>
          <div className='flex flex-col sm:flex-row gap-3 justify-center'>
            <Link href='/sign-up' className='btn-primary px-7 py-3'>
              Open your wallet
            </Link>
            <Link href='/contact' className='btn-ghost px-7 py-3'>
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
