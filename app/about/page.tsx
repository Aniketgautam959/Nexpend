import Link from 'next/link';

const AboutPage = () => {
  return (
    <div className='dot-grid min-h-screen text-foreground'>
      <section className='text-center pt-16 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6'>
        <div className='max-w-3xl mx-auto'>
          <div className='section-label'>Powered by AI Technology</div>
          <h1 className='font-semibold tracking-tight text-4xl sm:text-5xl md:text-6xl text-zinc-900 dark:text-white leading-tight mb-5'>
            About Nexpend
          </h1>
          <p className='text-base sm:text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto mb-8'>
            Your intelligent companion for tracking expenses and managing finances
            with calm, AI-powered clarity.
          </p>
          <div className='flex flex-col sm:flex-row gap-3 justify-center'>
            <Link href='/sign-up' className='btn-primary px-7 py-3'>
              Start Your Journey
            </Link>
            <Link href='/contact' className='btn-ghost px-7 py-3'>
              Learn More
            </Link>
          </div>
        </div>
      </section>

      <section className='px-4 sm:px-6 py-12 sm:py-16 border-t border-zinc-200 dark:border-zinc-800'>
        <div className='max-w-3xl mx-auto text-center'>
          <div className='section-label'>Our Mission</div>
          <h2 className='font-semibold tracking-tight text-3xl sm:text-4xl md:text-5xl text-zinc-900 dark:text-white mb-6'>
            Transforming financial management with AI
          </h2>
          <p className='text-zinc-500 dark:text-zinc-400 leading-relaxed'>
            We leverage AI to make personal finance smarter and more intuitive —
            analyzing spending patterns to deliver recommendations that lead to
            better budgeting and financial freedom.
          </p>
        </div>
      </section>

      <section className='px-4 sm:px-6 py-12 sm:py-16 border-t border-zinc-200 dark:border-zinc-800'>
        <div className='max-w-6xl mx-auto'>
          <div className='text-center mb-10'>
            <div className='section-label'>Features</div>
            <h2 className='font-semibold tracking-tight text-3xl sm:text-4xl md:text-5xl text-zinc-900 dark:text-white mb-4'>
              Why choose Nexpend?
            </h2>
            <p className='text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto'>
              Powerful features wrapped in a refined, distraction-free interface.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5'>
            {[
              {
                title: 'AI-Powered Insights',
                body: 'Intelligent analysis of spending patterns with personalized recommendations that learn from your behavior.',
              },
              {
                title: 'Smart Categorization',
                body: 'Automatic expense categorization with high accuracy and tailored suggestions for cleaner records.',
              },
              {
                title: 'Intelligent Dashboard',
                body: 'A modern interface with real-time insights, analytics, and visualizations that make sense of your data.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className='surface-card p-6 sm:p-7 shadow-soft dark:shadow-soft-dark'
              >
                <div className='icon-tile mb-5'>
                  <span className='text-xs font-bold text-accent'>✦</span>
                </div>
                <h3 className='font-semibold tracking-tight text-2xl text-zinc-900 dark:text-white mb-3'>
                  {feature.title}
                </h3>
                <p className='text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed'>
                  {feature.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='px-4 sm:px-6 py-12 sm:py-16 border-t border-zinc-200 dark:border-zinc-800'>
        <div className='max-w-4xl mx-auto'>
          <div className='text-center mb-10'>
            <div className='section-label'>Our Story</div>
            <h2 className='font-semibold tracking-tight text-3xl sm:text-4xl md:text-5xl text-zinc-900 dark:text-white'>
              Built for the future
            </h2>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-8 items-start'>
            <div className='space-y-4 text-zinc-500 dark:text-zinc-400 leading-relaxed'>
              <p>
                Nexpend was founded in 2025 with a vision for truly
                intelligent financial tools — clearer, calmer, and more effective.
              </p>
              <p>
                Since launch, we&apos;ve helped thousands of users improve their
                budgeting through AI. Every feature is designed with experience
                and financial wellness in mind.
              </p>
            </div>

            <div className='surface-card p-6 shadow-soft dark:shadow-soft-dark space-y-4'>
              {['Founded in 2025', 'AI-First Approach', 'Global Impact', 'User-Centric Design'].map(
                (item) => (
                  <div key={item} className='flex items-center gap-3'>
                    <div className='w-2 h-2 rounded-full bg-accent' />
                    <span className='text-sm font-medium text-zinc-900 dark:text-white'>
                      {item}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      <section className='px-4 sm:px-6 py-16 sm:py-20 border-t border-zinc-200 dark:border-zinc-800 text-center'>
        <div className='max-w-2xl mx-auto'>
          <h2 className='font-semibold tracking-tight text-3xl sm:text-4xl md:text-5xl text-zinc-900 dark:text-white mb-4'>
            Take control of your financial future
          </h2>
          <p className='text-zinc-500 dark:text-zinc-400 mb-8'>
            Start tracking smarter with Nexpend.
          </p>
          <div className='flex flex-col sm:flex-row gap-3 justify-center'>
            <Link href='/sign-up' className='btn-primary px-7 py-3'>
              Get Started Free →
            </Link>
            <Link href='/contact' className='btn-ghost px-7 py-3'>
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
