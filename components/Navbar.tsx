'use client';

import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import { useState } from 'react';
import { logoutAction } from '@/lib/auth-actions';

type NavUser = {
  id: string;
  email: string;
  name: string | null;
  imageUrl: string | null;
} | null;

export default function Navbar({ user }: { user: NavUser }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className='sticky top-0 z-50 border-b border-zinc-200/70 dark:border-zinc-800/70 bg-[var(--background)]/75 backdrop-blur-xl'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-14 sm:h-16'>
          <Link href='/' className='flex items-center gap-2.5' onClick={closeMobileMenu}>
            <div className='w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white flex items-center justify-center'>
              <svg className='w-4 h-4 text-white dark:text-zinc-900' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5'>
                <path strokeLinecap='round' strokeLinejoin='round' d='M12 3v18M5 10l7-7 7 7' />
              </svg>
            </div>
            <span className='text-base font-semibold tracking-tight text-zinc-900 dark:text-white'>
              Nexpend
            </span>
          </Link>

          <div className='hidden md:flex items-center gap-7'>
            {!user ? (
              <>
                <Link href='/' className='nav-link'>Home</Link>
                <Link href='/#features' className='nav-link'>Features</Link>
              </>
            ) : (
              <>
                <Link href='/' className='nav-link'>Dashboard</Link>
              </>
            )}
            <Link href='/about' className='nav-link'>About</Link>
            <Link href='/contact' className='nav-link'>Contact</Link>
          </div>

          <div className='flex items-center gap-2 sm:gap-3'>
            <ThemeToggle />

            <div className='flex items-center gap-2'>
              {!user ? (
                <div className='hidden sm:flex items-center gap-2'>
                  <Link href='/sign-in' className='nav-link px-2 py-1.5'>Login</Link>
                  <Link href='/sign-up' className='btn-primary !py-2 !px-4 !rounded-full'>
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div className='relative'>
                  <button
                    type='button'
                    onClick={() => setMenuOpen((v) => !v)}
                    className='h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-200 overflow-hidden flex items-center justify-center'
                    aria-label='Account menu'
                  >
                    {user.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={user.imageUrl} alt='' className='h-full w-full object-cover' />
                    ) : (
                      (user.name || user.email).charAt(0).toUpperCase()
                    )}
                  </button>
                  {menuOpen && (
                    <div className='absolute right-0 mt-2 w-52 panel p-1.5 shadow-lg z-50'>
                      <div className='px-3 py-2 border-b border-zinc-200 dark:border-zinc-800 mb-1'>
                        <p className='text-sm font-medium text-zinc-900 dark:text-white truncate'>
                          {user.name || 'User'}
                        </p>
                        <p className='text-xs text-zinc-500 truncate'>{user.email}</p>
                      </div>
                      <Link
                        href='/profile'
                        className='block px-3 py-2 text-sm rounded-lg nav-link hover:bg-zinc-100 dark:hover:bg-zinc-900'
                        onClick={() => setMenuOpen(false)}
                      >
                        Settings
                      </Link>
                      <form action={logoutAction}>
                        <button
                          type='submit'
                          className='w-full text-left px-3 py-2 text-sm rounded-lg text-red-500 hover:bg-red-500/10'
                        >
                          Sign out
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              className='md:hidden p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900'
              aria-label='Toggle menu'
            >
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                {isMobileMenuOpen ? (
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                ) : (
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
                )}
              </svg>
            </button>
          </div>
        </div>

        <div
          className={`md:hidden transition-all duration-300 ${
            isMobileMenuOpen ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className='panel p-2 mt-1 space-y-0.5'>
            {!user ? (
              <>
                <Link href='/' className='block px-3 py-2.5 rounded-xl nav-link' onClick={closeMobileMenu}>Home</Link>
                <Link href='/#features' className='block px-3 py-2.5 rounded-xl nav-link' onClick={closeMobileMenu}>Features</Link>
              </>
            ) : (
              <>
                <Link href='/' className='block px-3 py-2.5 rounded-xl nav-link' onClick={closeMobileMenu}>Dashboard</Link>
              </>
            )}
            <Link href='/about' className='block px-3 py-2.5 rounded-xl nav-link' onClick={closeMobileMenu}>About</Link>
            <Link href='/contact' className='block px-3 py-2.5 rounded-xl nav-link' onClick={closeMobileMenu}>Contact</Link>

            <div className='pt-2 border-t border-zinc-200 dark:border-zinc-800 space-y-2 px-1 pb-1'>
              {!user ? (
                <>
                  <Link href='/sign-in' className='block w-full text-center btn-ghost' onClick={closeMobileMenu}>
                    Login
                  </Link>
                  <Link href='/sign-up' className='block w-full text-center btn-primary' onClick={closeMobileMenu}>
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href='/profile'
                    className='block w-full text-center btn-ghost'
                    onClick={closeMobileMenu}
                  >
                    Settings
                  </Link>
                  <form action={logoutAction}>
                    <button type='submit' className='w-full btn-ghost text-red-500'>
                      Sign out
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
