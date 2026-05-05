'use client';

import { useTranslations } from 'next-intl';

export function RecentSessions() {
  const t = useTranslations('chat.sessions');
  const demos = t.raw('demos') as { label: string; age: string }[];

  return (
    <div>
      <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-muted">{t('recentLabel')}</div>
      <ul className="space-y-1">
        {demos.map(s => (
          <li key={s.label}>
            <button className="w-full rounded-xl px-3 py-2 text-left text-sm text-text hover:bg-soft transition">
              {s.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
