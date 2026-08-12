import Link from 'next/link';

const Footer = () => {
  return (
    <footer className='border-t border-zinc-200 dark:border-zinc-800 bg-background'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-10 mb-10'>
          <div>
            <div className='inline-flex items-center gap-2.5 mb-4'>
              <div className='w-8 h-8 rounded-lg bg-accent flex items-center justify-center'>
                <svg className='w-4 h-4 text-accent-foreground' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5'>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M12 3v18M5 10l7-7 7 7' />
                </svg>
              </div>
              <h2 className='text-lg font-semibold text-zinc-900 dark:text-white'>
                Nexpend
              </h2>
            </div>
            <p className='text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-sm'>
              Intelligent financial management powered by AI. Track expenses,
              manage your budget, and unlock clearer spending insights.
            </p>
          </div>

          <div>
            <h3 className='font-semibold tracking-tight text-xl text-zinc-900 dark:text-white mb-4'>
              Quick Links
            </h3>
            <div className='flex flex-col gap-2.5'>
              <Link href='/' className='nav-link w-fit'>
                Home
              </Link>
              <Link href='/about' className='nav-link w-fit'>
                About
              </Link>
              <Link href='/contact' className='nav-link w-fit'>
                Contact
              </Link>
            </div>
          </div>

          <div>
            <h3 className='font-semibold tracking-tight text-xl text-zinc-900 dark:text-white mb-4'>
              Features
            </h3>
            <div className='space-y-3'>
              <div className='flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400'>
                <div className='icon-tile !h-7 !w-7 !rounded-lg text-xs font-semibold'>AI</div>
                AI-Powered Insights
              </div>
              <div className='flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400'>
                <div className='icon-tile !h-7 !w-7 !rounded-lg text-xs font-semibold'>SC</div>
                Smart Categorization
              </div>
              <div className='flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400'>
                <div className='icon-tile !h-7 !w-7 !rounded-lg text-xs font-semibold'>AD</div>
                Analytics Dashboard
              </div>
            </div>
          </div>
        </div>

        <div className='h-px w-full bg-zinc-200 dark:bg-zinc-800 mb-6' />

        <p className='text-sm text-zinc-500 dark:text-zinc-400 text-center md:text-left'>
          © {new Date().getFullYear()} Nexpend. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
