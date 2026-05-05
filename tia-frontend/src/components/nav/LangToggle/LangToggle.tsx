'use client'; // locale switching via router.replace

import './style.css';
import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useTransition } from 'react';
import { cn } from '@/lib/utils/cn';

export function LangToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const current = useLocale();
  const [isPending, startTransition] = useTransition();

  const switchTo = (loc: 'pt-BR' | 'en') => {
    if (loc === current || isPending) return;
    const next = pathname.replace(/^\/(pt-BR|en)/, `/${loc}`);
    startTransition(() => {
      router.replace(next);
      router.refresh();
    });
  };

  const baseChip = 'px-2.5 py-1 text-xs rounded-full font-mono transition-all cursor-pointer';

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-full p-1 bg-soft border border-border shadow-sm'
      )}
    >
      {(['pt-BR', 'en'] as const).map((l) => {
        const on = l === current;
        return (
          <button
            key={l}
            onClick={() => switchTo(l)}
            disabled={isPending}
            className={cn(
              baseChip,
              on
                ? 'bg-primary text-white shadow-sm'
                : 'text-muted hover:text-text',
              isPending && on && 'opacity-70 cursor-wait'
            )}
          >
            {l === 'pt-BR' ? 'PT-BR' : 'EN'}
          </button>
        );
      })}
    </div>
  );
}
