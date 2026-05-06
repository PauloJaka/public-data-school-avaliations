'use client';

import './style.css';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

export function ChatInput({ onSubmit, disabled }: { onSubmit: (q: string) => void; disabled?: boolean }) {
  const t = useTranslations('chat.input');
  const [v, setV] = useState('');

  function submit(e: SubmitEvent | { preventDefault: () => void }) {
    e.preventDefault();
    const q = v.trim();
    if (!q || disabled) return;
    onSubmit(q);
    setV('');
  }

  return (
    <form onSubmit={e => submit(e.nativeEvent)}>
      <div className="input-wrap flex items-end gap-2 rounded-2xl border border-border bg-surface p-2 transition">
        <textarea
          value={v}
          onChange={e => setV(e.target.value)}
          rows={1}
          placeholder={t('placeholder')}
          className="min-h-[40px] flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              const q = v.trim();
              if (!q || disabled) return;
              onSubmit(q);
              setV('');
            }
          }}
        />
        <button
          type="submit"
          disabled={disabled || !v.trim()}
          className="send-btn inline-flex h-10 w-10 items-center justify-center rounded-xl bg-cta text-white shadow disabled:opacity-50"
          aria-label="Enviar"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M3 12l18-9-7 18-2-7-9-2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      <div className="input-meta mt-2 hidden md:flex justify-between font-mono text-[10px] text-muted">
        <span>{t('shiftEnter')}</span>
        <span>{t('model')}</span>
      </div>
    </form>
  );
}
