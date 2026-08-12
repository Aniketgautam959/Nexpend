'use client';

const ContactPage = () => {
  return (
    <div className='dot-grid min-h-screen text-foreground'>
      <section className='text-center pt-16 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6'>
        <div className='max-w-3xl mx-auto'>
          <div className='section-label'>Get in Touch</div>
          <h1 className='font-semibold tracking-tight text-4xl sm:text-5xl md:text-6xl text-zinc-900 dark:text-white leading-tight mb-5'>
            Contact Nexpend
          </h1>
          <p className='text-base sm:text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto mb-8'>
            Questions about AI-powered expense tracking? We&apos;re here to help.
          </p>
          <a href='mailto:aniket10bhp@gmail.com' className='btn-primary px-7 py-3 inline-flex'>
            Send us an Email
          </a>
        </div>
      </section>

      <section className='px-4 sm:px-6 py-12 sm:py-16 border-t border-zinc-200 dark:border-zinc-800'>
        <div className='max-w-6xl mx-auto'>
          <div className='text-center mb-10'>
            <div className='section-label'>Contact Information</div>
            <h2 className='font-semibold tracking-tight text-3xl sm:text-4xl text-zinc-900 dark:text-white mb-3'>
              Multiple ways to connect
            </h2>
            <p className='text-zinc-500 dark:text-zinc-400'>
              Choose the most convenient way to reach out.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5'>
            <div className='surface-card p-6 sm:p-7 text-center shadow-soft dark:shadow-soft-dark'>
              <div className='icon-tile mx-auto mb-5'>
                <span className='text-xs font-bold'>EM</span>
              </div>
              <h3 className='font-semibold tracking-tight text-2xl text-zinc-900 dark:text-white mb-2'>
                Email Support
              </h3>
              <p className='text-sm text-zinc-500 dark:text-zinc-400 mb-4'>
                Detailed assistance with responses typically within 24 hours.
              </p>
              <a
                href='mailto:aniket10bhp@gmail.com'
                className='text-sm font-medium text-accent hover:text-green-400 break-all'
              >
                aniket10bhp@gmail.com →
              </a>
            </div>

            <div className='surface-card p-6 sm:p-7 text-center shadow-soft dark:shadow-soft-dark'>
              <div className='icon-tile mx-auto mb-5'>
                <svg className='w-5 h-5' viewBox='0 0 24 24' fill='currentColor'>
                  <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
                </svg>
              </div>
              <h3 className='font-semibold tracking-tight text-2xl text-zinc-900 dark:text-white mb-2'>
                GitHub
              </h3>
              <p className='text-sm text-zinc-500 dark:text-zinc-400 mb-4'>
                Explore the source, report issues, or contribute.
              </p>
              <a
                href='https://github.com/Aniketgautam959/next-expense-tracker-ai'
                target='_blank'
                rel='noopener noreferrer'
                className='text-sm font-medium text-accent hover:text-green-400'
              >
                View on GitHub →
              </a>
            </div>

            <div className='surface-card p-6 sm:p-7 text-center shadow-soft dark:shadow-soft-dark'>
              <div className='icon-tile mx-auto mb-5'>
                <svg className='w-5 h-5' viewBox='0 0 24 24' fill='currentColor'>
                  <path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
                </svg>
              </div>
              <h3 className='font-semibold tracking-tight text-2xl text-zinc-900 dark:text-white mb-2'>
                LinkedIn
              </h3>
              <p className='text-sm text-zinc-500 dark:text-zinc-400 mb-4'>
                Connect professionally and stay updated.
              </p>
              <a
                href='https://www.linkedin.com/in/aniket-gautam-883053278/'
                target='_blank'
                rel='noopener noreferrer'
                className='text-sm font-medium text-accent hover:text-green-400'
              >
                Connect on LinkedIn →
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className='px-4 sm:px-6 py-12 sm:py-16 border-t border-zinc-200 dark:border-zinc-800'>
        <div className='max-w-4xl mx-auto'>
          <div className='text-center mb-10'>
            <div className='section-label'>Support</div>
            <h2 className='font-semibold tracking-tight text-3xl sm:text-4xl text-zinc-900 dark:text-white'>
              We&apos;re here to help
            </h2>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5'>
            <div className='surface-card p-5 sm:p-6 shadow-soft dark:shadow-soft-dark'>
              <h3 className='font-semibold tracking-tight text-xl text-zinc-900 dark:text-white mb-4'>
                Support Hours
              </h3>
              <div className='space-y-2 text-sm text-zinc-500 dark:text-zinc-400'>
                <div className='flex justify-between gap-4'>
                  <span>Monday - Friday</span>
                  <span className='font-medium text-zinc-800 dark:text-zinc-200'>9:00 AM - 6:00 PM PST</span>
                </div>
                <div className='flex justify-between gap-4'>
                  <span>Saturday</span>
                  <span className='font-medium text-zinc-800 dark:text-zinc-200'>10:00 AM - 4:00 PM PST</span>
                </div>
                <div className='flex justify-between gap-4'>
                  <span>Sunday</span>
                  <span className='font-medium text-zinc-800 dark:text-zinc-200'>Closed</span>
                </div>
                <div className='mt-4 surface-inset p-3 text-xs'>
                  Email support available 24/7 with responses within 24 hours.
                </div>
              </div>
            </div>

            <div className='surface-card p-5 sm:p-6 shadow-soft dark:shadow-soft-dark'>
              <h3 className='font-semibold tracking-tight text-xl text-zinc-900 dark:text-white mb-4'>
                Quick Help
              </h3>
              <div className='space-y-3'>
                {[
                  {
                    title: 'Technical Issues',
                    body: 'App not working properly? Reach out with details and screenshots.',
                  },
                  {
                    title: 'AI Features',
                    body: 'Questions about insights or categorization? We can walk you through it.',
                  },
                  {
                    title: 'Account & Billing',
                    body: 'Account issues or billing questions? Contact us directly.',
                  },
                ].map((item) => (
                  <div key={item.title} className='surface-inset p-3'>
                    <h4 className='font-medium text-zinc-900 dark:text-white text-sm mb-1'>
                      {item.title}
                    </h4>
                    <p className='text-xs text-zinc-500 dark:text-zinc-400'>
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
