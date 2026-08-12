import Link from 'next/link';

const Guest = () => {
  return (
    <div className='dot-grid min-h-screen text-foreground'>
      {/* Hero */}
      <section className='relative overflow-hidden flex flex-col items-center justify-center text-center pt-20 sm:pt-28 pb-16 sm:pb-20 px-4 sm:px-6'>
        <div className='relative z-10 max-w-4xl mx-auto w-full'>
          <div className='section-label'>
            AI-Powered Financial Management
          </div>

          <h1 className='font-semibold tracking-tight text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-zinc-900 dark:text-white leading-[1.1] mb-5 sm:mb-6'>
            Spending, refined.
          </h1>

          <p className='text-base sm:text-lg md:text-xl text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-2xl mx-auto mb-8'>
            Track expenses, manage your budget, and get AI-powered insights —
            all in one calm, intelligent workspace built for clarity.
          </p>

          <div className='flex flex-col sm:flex-row gap-3 justify-center mb-10'>
            <Link href='/sign-up' className='btn-primary px-7 py-3 text-base'>
              Get Started Free
              <span aria-hidden>→</span>
            </Link>
            <a
              href='#features'
              className='btn-ghost px-7 py-3 text-base'
            >
              Explore Features
            </a>
          </div>

          <div className='flex flex-wrap items-center justify-center gap-2'>
            {['NEXT.JS 15', 'TAILWIND CSS', 'AI INSIGHTS', 'PRISMA'].map(
              (tag) => (
                <span key={tag} className='pill-badge'>
                  {tag}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id='features' className='px-4 sm:px-6 pb-16 sm:pb-20'>
        <div className='max-w-6xl mx-auto'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5'>
            <div className='surface-card p-6 sm:p-7 shadow-soft dark:shadow-soft-dark hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors'>
              <div className='icon-tile mb-5'>
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.75} d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' />
                </svg>
              </div>
              <h3 className='font-semibold tracking-tight text-2xl text-zinc-900 dark:text-white mb-2'>
                AI Insights
              </h3>
              <p className='text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed'>
                Smart analysis of your spending patterns with personalized
                recommendations you can act on.
              </p>
            </div>

            <div className='surface-card p-6 sm:p-7 shadow-soft dark:shadow-soft-dark hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors'>
              <div className='icon-tile mb-5'>
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.75} d='M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' />
                </svg>
              </div>
              <h3 className='font-semibold tracking-tight text-2xl text-zinc-900 dark:text-white mb-2'>
                Auto Categories
              </h3>
              <p className='text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed'>
                Describe an expense and let AI suggest the right category —
                faster logging, cleaner records.
              </p>
            </div>

            <div className='surface-card p-6 sm:p-7 shadow-soft dark:shadow-soft-dark hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors'>
              <div className='icon-tile mb-5'>
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.75} d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' />
                </svg>
              </div>
              <h3 className='font-semibold tracking-tight text-2xl text-zinc-900 dark:text-white mb-2'>
                Smart Dashboard
              </h3>
              <p className='text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed'>
                A calm overview of charts, stats, and history — designed for
                focus, not clutter.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section id='tech-stack' className='px-4 sm:px-6 py-16 sm:py-20 border-t border-zinc-200 dark:border-zinc-800'>
        <div className='max-w-6xl mx-auto'>
          <div className='text-center mb-12'>
            <div className='section-label'>Modern Tech Stack</div>
            <h2 className='font-semibold tracking-tight text-3xl sm:text-4xl md:text-5xl text-zinc-900 dark:text-white mb-4'>
              Built with care
            </h2>
            <p className='text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto'>
              Powered by modern tools for performance, security, and a polished experience.
            </p>
          </div>

          <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4'>
            {[
              { name: 'Next.js 15', detail: 'Full-stack' },
              { name: 'Tailwind', detail: 'Utility CSS' },
              { name: 'OpenAI', detail: 'AI layer' },
              { name: 'Prisma', detail: 'ORM' },
              { name: 'Clerk', detail: 'Auth' },
              { name: 'Vercel', detail: 'Deploy' },
            ].map((item) => (
              <div
                key={item.name}
                className='surface-card p-4 sm:p-5 text-center shadow-soft dark:shadow-soft-dark hover:border-accent/40 transition-colors'
              >
                <div className='font-semibold tracking-tight text-lg text-zinc-900 dark:text-white mb-1'>
                  {item.name}
                </div>
                <div className='text-xs text-zinc-500 dark:text-zinc-400'>
                  {item.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className='px-4 sm:px-6 py-16 sm:py-20 border-t border-zinc-200 dark:border-zinc-800'>
        <div className='max-w-3xl mx-auto'>
          <div className='text-center mb-12'>
            <div className='section-label'>FAQ</div>
            <h2 className='font-semibold tracking-tight text-3xl sm:text-4xl md:text-5xl text-zinc-900 dark:text-white mb-4'>
              Questions, answered
            </h2>
            <p className='text-zinc-500 dark:text-zinc-400'>
              Everything you need to know about Nexpend.
            </p>
          </div>

          <div className='space-y-3'>
            {[
              {
                q: 'What is Nexpend?',
                a: 'An intelligent financial management tool that uses AI to monitor spending patterns, suggest categories, and deliver personalized insights.',
              },
              {
                q: 'How does the AI work?',
                a: 'Our AI analyzes your spending data to categorize expenses, detect patterns, and answer questions about your habits with clear, actionable responses.',
              },
              {
                q: 'Is Nexpend free?',
                a: 'Yes — get started free with smart categorization and insights. Premium plans unlock advanced analytics when you need them.',
              },
            ].map((item) => (
              <div
                key={item.q}
                className='surface-card p-5 sm:p-6 shadow-soft dark:shadow-soft-dark'
              >
                <h3 className='font-semibold tracking-tight text-xl text-zinc-900 dark:text-white mb-2'>
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
        <div className='max-w-6xl mx-auto'>
          <div className='text-center mb-12'>
            <div className='section-label'>Testimonials</div>
            <h2 className='font-semibold tracking-tight text-3xl sm:text-4xl md:text-5xl text-zinc-900 dark:text-white mb-4'>
              Loved by early users
            </h2>
            <p className='text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto'>
              People using Nexpend to bring calm and clarity to their budgets.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5'>
            {[
              {
                name: 'Sarah L.',
                quote:
                  'Nexpend transformed my budgeting. The AI insights are clear and I finally feel in control of my spending.',
              },
              {
                name: 'John D.',
                quote:
                  'Smart categorization alone saved me hours. The insights helped me cut waste I never noticed before.',
              },
              {
                name: 'Emily R.',
                quote:
                  'Clean, intelligent, and easy. The recommendations are spot-on and have genuinely improved my habits.',
              },
            ].map((t) => (
              <div
                key={t.name}
                className='surface-card p-6 shadow-soft dark:shadow-soft-dark'
              >
                <div className='flex items-center gap-3 mb-4'>
                  <div className='h-10 w-10 rounded-full bg-accent/15 text-accent flex items-center justify-center font-semibold text-sm'>
                    {t.name[0]}
                  </div>
                  <div>
                    <div className='font-medium text-zinc-900 dark:text-white text-sm'>
                      {t.name}
                    </div>
                    <div className='text-xs text-zinc-500 dark:text-zinc-400'>
                      Verified User
                    </div>
                  </div>
                </div>
                <p className='text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4'>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className='text-xs text-accent font-medium'>5/5 Rating</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className='px-4 sm:px-6 py-16 sm:py-24 border-t border-zinc-200 dark:border-zinc-800'>
        <div className='max-w-3xl mx-auto text-center'>
          <h2 className='font-semibold tracking-tight text-3xl sm:text-4xl md:text-5xl text-zinc-900 dark:text-white mb-4'>
            Ready to take control?
          </h2>
          <p className='text-zinc-500 dark:text-zinc-400 mb-8 max-w-xl mx-auto'>
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
