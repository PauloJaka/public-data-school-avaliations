'use client'; // uses usePathname for active link detection + LangToggle is interactive

import './style.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { BrandLogo } from '../BrandLogo/BrandLogo';
import { LangToggle } from '../LangToggle/LangToggle';
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';
import { cn } from '@/lib/utils/cn';

export interface NavbarProps {
  /** When true, navbar is sticky with glass effect (dashboard/chat). */
  floating?: boolean;
}

export function Navbar({ floating = false }: NavbarProps) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const locale = useLocale();

  const items = [
    { href: `/${locale}`,           label: t('platform'), anchor: false },
    { href: `/${locale}/dashboard`, label: t('data'),     anchor: false },
    { href: `/${locale}/chat`,      label: t('chat'),     anchor: false },
    { href: `/${locale}#about`,     label: t('about'),    anchor: true  },
  ];

  return (
    <div
      className={cn(
        'w-full z-50',
        floating ? 'sticky top-[18px] px-6' : 'relative px-8 py-5'
      )}
    >
      <nav
        className={cn(
          'mx-auto max-w-[1280px] flex items-center justify-between',
          floating && 'rounded-2xl px-6 py-3 backdrop-blur-xl border bg-surface/85 border-border shadow-[var(--shadow-glass)]'
        )}
      >
        <Link href={`/${locale}`} className="flex items-center gap-3">
          <BrandLogo />
          <span className="font-semibold tracking-wide text-lg text-text">
            T.I.A
          </span>
        </Link>

        <div className="flex items-center gap-7">
          {items.map((it) => {
            const active = !it.anchor && (
              (it.href !== `/${locale}` && pathname?.startsWith(it.href)) ||
              (it.href === `/${locale}` && (pathname === `/${locale}` || pathname === `/${locale}/`))
            );
            return (
              <Link
                key={it.href}
                href={it.href}
                className={cn(
                  'text-sm transition-colors',
                  active ? 'text-text font-medium' : 'text-muted hover:text-text'
                )}
              >
                {it.label}
              </Link>
            );
          })}
          <div className="flex items-center gap-2">
            <LangToggle />
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </div>
  );
}
