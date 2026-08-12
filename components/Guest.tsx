import Link from 'next/link';

const features = [
  {
    title: 'AI Insights',
    body: 'See spending patterns and get clear recommendations you can act on.',
    icon: (
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.75}
        d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
      />
    ),
  },
  {
    title: 'Screenshot scan',
    body: 'Drop a UPI receipt and Nexpend fills amount, merchant, and category.',
    icon: (
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.75}
        d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
      />
    ),
  },
  {
    title: 'Calm dashboard',
    body: 'Charts, budget left, and history — designed for focus, not clutter.',
    icon: (
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.75}
        d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
      />
    ),
  },
];

const Guest = () => {
  return (
    <div className='dot-grid min-h-screen text-foreground'>
      {/* Hero */}
      <section className='relative overflow-hidden px-4 sm:px-6 pt-16 sm:pt-24 pb-14 sm:pb-20'>
        <div
          aria-hidden
          className='pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(ellipse_at_top,rgba(34,197,94,0.16),transparent_58%)] animate-[guestGlow_8s_ease-in-out_infinite]'
        />

        <div className='relative z-10 max-w-5xl mx-auto text-center'>
          <p className='guest-reveal text-sm sm:text-base font-semibold tracking-[0.18em] uppercase text-accent mb-5 sm:mb-6'>
            Nexpend
          </p>

          <h1 className='guest-reveal guest-reveal-delay-1 font-semibold tracking-tight text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] text-zinc-900 dark:text-white leading-[1.05] mb-5'>
            Spending, refined.
          </h1>

          <p className='guest-reveal guest-reveal-delay-2 text-base sm:text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xl mx-auto mb-8'>
            Track expenses, scan payment screenshots, and get AI insights —
            one calm workspace for every spend.
          </p>

          <div className='guest-reveal guest-reveal-delay-3 flex flex-col sm:flex-row gap-3 justify-center'>
            <Link href='/sign-up' className='btn-primary px-7 py-3 text-base'>
              Get Started Free
              <span aria-hidden>→</span>
            </Link>
            <a href='#features' className='btn-ghost px-7 py-3 text-base'>
              Explore Features
            </a>
          </div>

          {/* Product preview strip */}
          <div className='guest-reveal guest-reveal-delay-4 mt-12 sm:mt-16 mx-auto max-w-3xl'>
            <div className='rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/60 backdrop-blur-sm p-4 sm:p-5 shadow-soft dark:shadow-soft-dark'>
              <div className='grid grid-cols-3 gap-3 sm:gap-4 text-left'>
                {[
                  { label: 'This month', value: '₹12,480' },
                  { label: 'Left to spend', value: '₹27,520' },
                  { label: 'Savings goal', value: 'On track' },
                ].map((item) => (
                  <div key={item.label} className='min-w-0'>
                    <p className='text-[10px] sm:text-xs text-zinc-500 truncate mb-1'>
                      {item.label}
                    </p>
                    <p className='text-sm sm:text-lg font-semibold tracking-tight text-zinc-900 dark:text-white tabular-nums truncate'>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
              <div className='mt-4 h-16 sm:h-20 rounded-xl bg-zinc-100 dark:bg-zinc-900/80 overflow-hidden flex items-end gap-1.5 px-3 pb-2'>
                {[40, 55, 35, 70, 48, 82, 60, 45, 75, 52, 68, 90].map((h, i) => (
                  <div
                    key={i}
                    className='flex-1 rounded-t-sm bg-accent/70 dark:bg-accent/60 animate-[guestBar_2.8s_ease-in-out_infinite]'
                    style={{
                      height: `${h}%`,
                      animationDelay: `${i * 0.08}s`,
                    }}
                  />
                ))}
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
              Built for everyday money
            </h2>
            <p className='text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto'>
              Log spends faster, understand where money goes, and stay ahead of your budget.
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
                a: 'An intelligent money tracker that uses AI to monitor spending, suggest categories, and deliver personalized insights.',
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
                  'Nexpend transformed my budgeting. The AI insights are clear and I finally feel in control.',
              },
              {
                name: 'John D.',
                quote:
                  'Screenshot scan alone saved me time. The insights helped me cut waste I never noticed.',
              },
              {
                name: 'Emily R.',
                quote:
                  'Clean, intelligent, and easy. The recommendations are spot-on for my habits.',
              },
            ].map((t) => (
              <figure key={t.name} className='md:border-l md:border-zinc-200 md:dark:border-zinc-800 md:pl-6'>
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
          <h2 className='font-semibold tracking-tight text-2xl sm:text-3xl md:text-4xl text-zinc-900 dark:text-white mb-3'>
            Ready to take control?
          </h2>
          <p className='text-sm sm:text-base text-zinc-500 dark:text-zinc-400 mb-7 max-w-md mx-auto'>
            Start tracking smarter today — free, fast, and built around clarity.
          </p>
          <Link href='/sign-up' className='btn-primary px-8 py-3 text-base inline-flex'>
            Sign Up Free
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Guest;
