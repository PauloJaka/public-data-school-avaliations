'use client';

import './style.css';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { BrandLogo } from '../BrandLogo/BrandLogo';
import { LangToggle } from '../LangToggle/LangToggle';
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';
import { cn } from '@/lib/utils/cn';

export interface NavbarProps {
  floating?: boolean;
}

export function Navbar({ floating = false }: NavbarProps) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const locale = useLocale();
  const [open, setOpen] = useState(false);

  const items = [
    { href: `/${locale}`,           label: t('platform'), anchor: false },
    { href: `/${locale}/dashboard`, label: t('data'),     anchor: false },
    { href: `/${locale}/chat`,      label: t('chat'),     anchor: false },
    { href: `/${locale}#about`,     label: t('about'),    anchor: true  },
  ];

  function isActive(it: typeof items[number]) {
    if (it.anchor) return false;
    if (it.href === `/${locale}`) return pathname === `/${locale}` || pathname === `/${locale}/`;
    return !!pathname?.startsWith(it.href);
  }

  return (
    <div
      className={cn(
        'w-full z-50',
        floating ? 'sticky top-[18px] px-6' : 'relative px-8 py-5'
      )}
    >
      <nav
        className={cn(
          'relative mx-auto max-w-[1280px] flex items-center justify-between',
          floating && 'rounded-2xl px-6 py-3 backdrop-blur-xl border bg-surface/85 border-border shadow-[var(--shadow-glass)]'
        )}
      >
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <BrandLogo />
          <span className="font-semibold tracking-wide text-lg text-text">T.I.A</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-7">
          {items.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className={cn(
                'text-sm transition-colors',
                isActive(it) ? 'text-text font-medium' : 'text-muted hover:text-text'
              )}
            >
              {it.label}
            </Link>
          ))}
          <div className="flex items-center gap-2">
            <LangToggle />
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile: toggles + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <LangToggle />
          <ThemeToggle />
          <button
            onClick={() => setOpen(o => !o)}
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={open}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface text-muted hover:text-text transition-colors"
          >
            {open ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            )}
          </button>
        </div>

        {/* Mobile dropdown drawer */}
        {open && (
          <div className="mobile-menu absolute top-full left-0 right-0 mt-2 flex flex-col rounded-2xl border border-border bg-surface/95 backdrop-blur-xl shadow-lg overflow-hidden z-50 md:hidden">
            {items.map((it) => (
              <Link
                key={it.href}
                href={it.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'px-5 py-3.5 text-sm border-b border-border last:border-b-0 transition-colors',
                  isActive(it) ? 'text-text font-medium bg-soft' : 'text-muted hover:text-text hover:bg-soft'
                )}
              >
                {it.label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </div>
  );
}
