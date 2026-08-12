import Link from 'next/link';

const features = [
  {
    title: 'Track every spend',
    body: 'Log UPI, cards, and cash in seconds — with merchant, category, and notes.',
    icon: (
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.75}
        d='M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'
      />
    ),
  },
  {
    title: 'Scan receipts',
    body: 'Drop a Paytm / GPay screenshot and Nexpend fills amount and payee for you.',
    icon: (
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.75}
        d='M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z'
      />
    ),
  },
  {
    title: 'Know what’s left',
    body: 'See budget left, recurring bills, and AI tips so you stay on track.',
    icon: (
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.75}
        d='M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z'
      />
    ),
  },
];

const recentSpends = [
  { name: 'Netflix', meta: 'Subscription', amount: '₹649', tone: 'text-indigo-400' },
  { name: 'Airtel recharge', meta: 'Bills', amount: '₹299', tone: 'text-amber-400' },
  { name: 'Swiggy', meta: 'Food', amount: '₹420', tone: 'text-orange-400' },
];

const Guest = () => {
  return (
    <div className='dot-grid min-h-screen text-foreground'>
      {/* Hero */}
      <section className='relative overflow-hidden px-4 sm:px-6 pt-14 sm:pt-20 pb-16 sm:pb-24'>
        <div
          aria-hidden
          className='pointer-events-none absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(ellipse_at_top,rgba(34,197,94,0.14),transparent_55%)]'
        />
        {/* Soft ₹ watermark */}
        <div
          aria-hidden
          className='pointer-events-none absolute right-[-4%] top-24 text-[12rem] sm:text-[16rem] font-semibold leading-none text-accent/[0.06] select-none'
        >
          ₹
        </div>

        <div className='relative z-10 max-w-6xl mx-auto'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center'>
            {/* Copy */}
            <div className='text-center lg:text-left'>
              <p className='guest-reveal inline-flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-[0.14em] uppercase text-accent mb-5'>
                <span className='h-7 w-7 rounded-lg bg-accent/15 flex items-center justify-center text-accent text-sm font-bold tracking-normal'>
                  ₹
                </span>
                Nexpend
              </p>

              <h1 className='guest-reveal guest-reveal-delay-1 font-semibold tracking-tight text-4xl sm:text-5xl md:text-6xl text-zinc-900 dark:text-white leading-[1.05] mb-5'>
                Your wallet,
                <br />
                finally clear.
              </h1>

              <p className='guest-reveal guest-reveal-delay-2 text-base sm:text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-md mx-auto lg:mx-0 mb-8'>
                Track expenses in ₹, scan UPI receipts, set recurring bills, and
                see exactly what’s left this month.
              </p>

              <div className='guest-reveal guest-reveal-delay-3 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start'>
                <Link href='/sign-up' className='btn-primary px-7 py-3 text-base'>
                  Start tracking free
                  <span aria-hidden>→</span>
                </Link>
                <a href='#features' className='btn-ghost px-7 py-3 text-base'>
                  See how it works
                </a>
              </div>
            </div>

            {/* Wallet / expense visual */}
            <div className='guest-reveal guest-reveal-delay-4 relative mx-auto w-full max-w-md lg:max-w-none'>
              <div className='rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 sm:p-6'>
                {/* Wallet header */}
                <div className='rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-800 dark:from-zinc-900 dark:to-black border border-zinc-700/50 p-5 mb-5 text-left'>
                  <div className='flex items-center justify-between mb-4'>
                    <div className='flex items-center gap-2.5'>
                      <div className='h-9 w-9 rounded-xl bg-accent flex items-center justify-center'>
                        <svg
                          className='w-4.5 h-4.5 text-accent-foreground'
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
                        <p className='text-[11px] text-zinc-400'>This month left</p>
                        <p className='text-xl font-semibold text-white tabular-nums tracking-tight'>
                          ₹27,520
                        </p>
                      </div>
                    </div>
                    <span className='text-[11px] font-medium text-accent bg-accent/10 px-2.5 py-1 rounded-full'>
                      On track
                    </span>
                  </div>
                  <div className='h-1.5 rounded-full bg-zinc-700 overflow-hidden'>
                    <div
                      className='h-full rounded-full bg-accent'
                      style={{ width: '32%' }}
                    />
                  </div>
                  <div className='flex justify-between mt-2 text-[11px] text-zinc-500'>
                    <span>Spent ₹12,480</span>
                    <span>Budget ₹40,000</span>
                  </div>
                </div>

                {/* Recent expenses */}
                <div className='text-left'>
                  <p className='text-xs font-medium text-zinc-500 mb-3'>
                    Recent expenses
                  </p>
                  <ul className='space-y-2.5'>
                    {recentSpends.map((item) => (
                      <li
                        key={item.name}
                        className='flex items-center justify-between gap-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/50 px-3.5 py-3'
                      >
                        <div className='flex items-center gap-3 min-w-0'>
                          <span
                            className={`h-9 w-9 rounded-xl bg-zinc-200/80 dark:bg-zinc-800 flex items-center justify-center text-sm font-semibold shrink-0 ${item.tone}`}
                          >
                            ₹
                          </span>
                          <div className='min-w-0'>
                            <p className='text-sm font-medium text-zinc-900 dark:text-white truncate'>
                              {item.name}
                            </p>
                            <p className='text-[11px] text-zinc-500'>{item.meta}</p>
                          </div>
                        </div>
                        <span className='text-sm font-semibold tabular-nums text-zinc-900 dark:text-white shrink-0'>
                          {item.amount}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id='features' className='px-4 sm:px-6 pb-16 sm:pb-20'>
        <div className='max-w-5xl mx-auto'>
          <div className='text-center mb-10 sm:mb-12'>
            <h2 className='font-semibold tracking-tight text-2xl sm:text-3xl md:text-4xl text-zinc-900 dark:text-white mb-3'>
              Built to manage your money
            </h2>
            <p className='text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto'>
              From daily UPI spends to rent and SIPs — one place for every rupee out.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10'>
            {features.map((f) => (
              <div key={f.title} className='text-center md:text-left'>
                <div className='icon-tile mx-auto md:mx-0 mb-4 text-accent border-accent/20 bg-accent/10'>
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    {f.icon}
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

      {/* FAQ */}
      <section className='px-4 sm:px-6 py-16 sm:py-20 border-t border-zinc-200 dark:border-zinc-800'>
        <div className='max-w-2xl mx-auto'>
          <div className='text-center mb-10'>
            <h2 className='font-semibold tracking-tight text-2xl sm:text-3xl md:text-4xl text-zinc-900 dark:text-white mb-3'>
              Questions, answered
            </h2>
            <p className='text-sm text-zinc-500 dark:text-zinc-400'>
              Everything you need to know about Nexpend.
            </p>
          </div>

          <div className='divide-y divide-zinc-200 dark:divide-zinc-800'>
            {[
              {
                q: 'What is Nexpend?',
                a: 'An expense tracker for Indian spending — log UPI, cards, and bills in ₹, with AI insights and recurring auto-logs.',
              },
              {
                q: 'Can I scan payment screenshots?',
                a: 'Yes — upload or drag a UPI / Paytm / GPay receipt and Nexpend auto-fills the expense form for you to review.',
              },
              {
                q: 'Is Nexpend free?',
                a: 'Yes — get started free with smart categorization and insights. Upgrade later if you need deeper analytics.',
              },
            ].map((item) => (
              <div key={item.q} className='py-5 first:pt-0 last:pb-0'>
                <h3 className='font-semibold tracking-tight text-base sm:text-lg text-zinc-900 dark:text-white mb-1.5'>
                  {item.q}
                </h3>
                <p className='text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed'>
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className='px-4 sm:px-6 py-16 sm:py-20 border-t border-zinc-200 dark:border-zinc-800'>
        <div className='max-w-5xl mx-auto'>
          <div className='text-center mb-10 sm:mb-12'>
            <h2 className='font-semibold tracking-tight text-2xl sm:text-3xl md:text-4xl text-zinc-900 dark:text-white mb-3'>
              Loved by early users
            </h2>
            <p className='text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto'>
              People using Nexpend to bring calm and clarity to their budgets.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8'>
            {[
              {
                name: 'Sarah L.',
                quote:
                  'I finally see where every rupee goes. Budget left is the first thing I check.',
              },
              {
                name: 'John D.',
                quote:
                  'Screenshot scan alone saved me time. Recurring Netflix and rent just show up.',
              },
              {
                name: 'Emily R.',
                quote:
                  'Feels like a real wallet app — clean, smart, and built for Indian payments.',
              },
            ].map((t) => (
              <figure
                key={t.name}
                className='md:border-l md:border-zinc-200 md:dark:border-zinc-800 md:pl-6'
              >
                <blockquote className='text-sm sm:text-[0.95rem] text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4'>
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className='flex items-center gap-2.5'>
                  <span className='h-8 w-8 rounded-full bg-accent/15 text-accent flex items-center justify-center font-semibold text-xs'>
                    {t.name[0]}
                  </span>
                  <span className='text-sm font-medium text-zinc-900 dark:text-white'>
                    {t.name}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className='px-4 sm:px-6 py-16 sm:py-24 border-t border-zinc-200 dark:border-zinc-800'>
        <div className='max-w-2xl mx-auto text-center rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/40 px-6 py-12 sm:py-14'>
          <div className='mx-auto mb-5 h-12 w-12 rounded-2xl bg-accent/15 text-accent flex items-center justify-center text-xl font-bold'>
            ₹
          </div>
          <h2 className='font-semibold tracking-tight text-2xl sm:text-3xl md:text-4xl text-zinc-900 dark:text-white mb-3'>
            Take control of every rupee
          </h2>
          <p className='text-sm sm:text-base text-zinc-500 dark:text-zinc-400 mb-7 max-w-md mx-auto'>
            Start tracking expenses today — free, fast, and built for how you pay.
          </p>
          <Link href='/sign-up' className='btn-primary px-8 py-3 text-base inline-flex'>
            Open your wallet
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Guest;
